import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Pedido, EstadoPedido } from '../entities/pedido.entity';
import { DetallePedido } from '../entities/detalle-pedido.entity';
import { CreatePedidoDto } from '../dto/create-pedido.dto';
import { UpdateEstadoPedidoDto } from '../dto/update-estado-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    @InjectRepository(DetallePedido)
    private detallePedidoRepository: Repository<DetallePedido>,
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  async create(createPedidoDto: CreatePedidoDto, clienteId: string): Promise<Pedido> {
    const { stallId, items } = createPedidoDto;

    // Validar que el puesto está activo
    await this.validatePuestoActivo(stallId);

    // Validar stock y obtener precios de productos
    const productosInfo = await this.validateStockAndGetPrices(items, stallId);

    // Calcular total
    let total = 0;
    items.forEach((item) => {
      const productoInfo = productosInfo.find((p) => p.id === item.productId);
      total += productoInfo.price * item.quantity;
    });

    // Crear pedido en transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear pedido
      const pedido = queryRunner.manager.create(Pedido, {
        customerId: clienteId,
        stallId,
        total,
        status: EstadoPedido.PENDIENTE,
      });
      const pedidoGuardado = await queryRunner.manager.save(Pedido, pedido);

      // Crear detalles del pedido
      const detalles: DetallePedido[] = [];
      for (const item of items) {
        const productoInfo = productosInfo.find((p) => p.id === item.productId);
        
        const detalle = queryRunner.manager.create(DetallePedido, {
          orderId: pedidoGuardado.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: productoInfo.price,
        });
        detalles.push(await queryRunner.manager.save(DetallePedido, detalle));

        // Descontar stock en el microservicio de productos
        await this.descontarStock(item.productId, item.quantity);
      }

      await queryRunner.commitTransaction();

      pedidoGuardado.detalles = detalles;
      return pedidoGuardado;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      relations: ['detalles'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCliente(clienteId: string): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      where: { customerId: clienteId },
      relations: ['detalles'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByPuesto(stallId: string): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      where: { stallId },
      relations: ['detalles'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: ['detalles'],
    });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return pedido;
  }

  async updateEstado(
    id: string,
    updateEstadoDto: UpdateEstadoPedidoDto,
    usuarioId: string,
    rol: string,
  ): Promise<Pedido> {
    const pedido = await this.findOne(id);

    // Validar transición de estado
    this.validateEstadoTransition(pedido.status, updateEstadoDto.estado);

    // Solo el emprendedor dueño del puesto o el cliente puede actualizar
    if (rol === 'emprendedor') {
      await this.validatePuestoOwner(pedido.stallId, usuarioId);
    } else if (rol === 'cliente') {
      if (pedido.customerId !== usuarioId) {
        throw new ForbiddenException('No tienes permiso para actualizar este pedido');
      }
    } else if (rol !== 'organizador') {
      throw new ForbiddenException('No tienes permiso para actualizar pedidos');
    }

    pedido.status = updateEstadoDto.estado;
    return this.pedidoRepository.save(pedido);
  }

  async cancelarPedido(id: string, clienteId: string): Promise<Pedido> {
    const pedido = await this.findOne(id);

    if (pedido.customerId !== clienteId) {
      throw new ForbiddenException('No tienes permiso para cancelar este pedido');
    }

    if (pedido.status === EstadoPedido.ENTREGADO) {
      throw new BadRequestException('No se puede cancelar un pedido entregado');
    }

    // Restaurar stock
    for (const detalle of pedido.detalles) {
      await this.restaurarStock(detalle.productId, detalle.quantity);
    }

    // Nota: El modelo SQL no incluye estado 'cancelado', así que eliminamos el pedido
    await this.pedidoRepository.remove(pedido);
    return pedido;
  }

  private async validateCliente(clienteId: string): Promise<void> {
    const authServiceUrl =
      this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';

    try {
      // Validar que el cliente existe y tiene rol cliente
      // Nota: En producción, esto debería recibir el token del request
      // Por ahora, asumimos que la validación se hace en el controlador
      // y el clienteId viene del token validado
    } catch (error) {
      throw new BadRequestException('Cliente no válido');
    }
  }

  private async validatePuestoActivo(stallId: string): Promise<void> {
    const puestosServiceUrl =
      this.configService.get<string>('PUESTOS_SERVICE_URL') || 'http://localhost:3002';

    try {
      const response = await axios.get(`${puestosServiceUrl}/puestos/${stallId}`);

      if (!response.data || response.data.status !== 'activo') {
        throw new BadRequestException('El puesto no está activo');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException('Puesto no encontrado');
      }
      throw new BadRequestException('El puesto no está disponible');
    }
  }

  private async validatePuestoOwner(stallId: string, emprendedorId: string): Promise<void> {
    const puestosServiceUrl =
      this.configService.get<string>('PUESTOS_SERVICE_URL') || 'http://localhost:3002';

    try {
      const response = await axios.get(`${puestosServiceUrl}/puestos/${stallId}`);

      if (response.data.ownerId !== emprendedorId) {
        throw new ForbiddenException('No eres el dueño de este puesto');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException('Puesto no encontrado');
      }
      throw error;
    }
  }

  private async validateStockAndGetPrices(
    items: { productId: string; quantity: number }[],
    stallId: string,
  ): Promise<{ id: string; name: string; price: number }[]> {
    const productosServiceUrl =
      this.configService.get<string>('PRODUCTOS_SERVICE_URL') || 'http://localhost:3003';

    const productosInfo: { id: string; name: string; price: number }[] = [];

    for (const item of items) {
      try {
        const response = await axios.get(
          `${productosServiceUrl}/productos/${item.productId}`,
        );

        const producto = response.data;

        // Validar que el producto pertenece al puesto
        if (producto.stallId !== stallId) {
          throw new BadRequestException(
            `El producto ${producto.name} no pertenece a este puesto`,
          );
        }

        // Validar stock
        if (!producto.isAvailable || producto.stock < item.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para el producto ${producto.name}`,
          );
        }

        productosInfo.push({
          id: producto.id,
          name: producto.name,
          price: parseFloat(producto.price),
        });
      } catch (error) {
        if (error.response?.status === 404) {
          throw new NotFoundException(`Producto ${item.productId} no encontrado`);
        }
        throw error;
      }
    }

    return productosInfo;
  }

  private async descontarStock(productId: string, quantity: number): Promise<void> {
    const productosServiceUrl =
      this.configService.get<string>('PRODUCTOS_SERVICE_URL') || 'http://localhost:3003';

    try {
      await axios.post(`${productosServiceUrl}/productos/${productId}/descontar-stock`, {
        cantidad: quantity,
      });
    } catch (error) {
      throw new BadRequestException('Error al descontar stock');
    }
  }

  private async restaurarStock(productId: string, quantity: number): Promise<void> {
    const productosServiceUrl =
      this.configService.get<string>('PRODUCTOS_SERVICE_URL') || 'http://localhost:3003';

    try {
      await axios.post(`${productosServiceUrl}/productos/${productId}/restaurar-stock`, {
        cantidad: quantity,
      });
    } catch (error) {
      // Si falla, no es crítico, solo loguear
      console.error('Error al restaurar stock:', error);
    }
  }

  private validateEstadoTransition(
    currentEstado: EstadoPedido,
    newEstado: EstadoPedido,
  ): void {
    const validTransitions: Record<EstadoPedido, EstadoPedido[]> = {
      [EstadoPedido.PENDIENTE]: [EstadoPedido.PREPARANDO],
      [EstadoPedido.PREPARANDO]: [EstadoPedido.LISTO],
      [EstadoPedido.LISTO]: [EstadoPedido.ENTREGADO],
      [EstadoPedido.ENTREGADO]: [],
    };

    if (!validTransitions[currentEstado]?.includes(newEstado)) {
      throw new BadRequestException(
        `Transición de estado inválida: ${currentEstado} -> ${newEstado}`,
      );
    }
  }
}

