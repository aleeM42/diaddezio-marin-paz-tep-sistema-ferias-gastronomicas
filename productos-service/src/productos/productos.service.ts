import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Producto } from '../entities/producto.entity';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';
import { FilterProductosDto } from '../dto/filter-productos.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    private configService: ConfigService,
  ) {}

  async create(createProductoDto: CreateProductoDto, emprendedorId: string): Promise<Producto> {
    // Validar que el puesto existe y pertenece al emprendedor
    await this.validatePuestoOwner(createProductoDto.stallId, emprendedorId);

    const producto = this.productoRepository.create({
      ...createProductoDto,
      isAvailable: createProductoDto.stock > 0,
    });

    return this.productoRepository.save(producto);
  }

  async findAll(filters?: FilterProductosDto): Promise<Producto[]> {
    const queryBuilder = this.productoRepository.createQueryBuilder('producto');

    queryBuilder.where('producto.isAvailable = :isAvailable', { isAvailable: true });
    queryBuilder.andWhere('producto.stock > :stock', { stock: 0 });

    if (filters?.category) {
      queryBuilder.andWhere('producto.category = :category', {
        category: filters.category,
      });
    }

    if (filters?.stallId) {
      queryBuilder.andWhere('producto.stallId = :stallId', {
        stallId: filters.stallId,
      });
    }

    if (filters?.priceMin !== undefined) {
      queryBuilder.andWhere('producto.price >= :priceMin', {
        priceMin: filters.priceMin,
      });
    }

    if (filters?.priceMax !== undefined) {
      queryBuilder.andWhere('producto.price <= :priceMax', {
        priceMax: filters.priceMax,
      });
    }

    return queryBuilder.orderBy('producto.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  async findByPuesto(stallId: string): Promise<Producto[]> {
    return this.productoRepository.find({
      where: { stallId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateProductoDto: UpdateProductoDto,
    emprendedorId: string,
  ): Promise<Producto> {
    const producto = await this.findOne(id);

    // Validar que el puesto pertenece al emprendedor
    await this.validatePuestoOwner(producto.stallId, emprendedorId);

    // Actualizar disponibilidad según stock
    if (updateProductoDto.stock !== undefined) {
      updateProductoDto.isAvailable = updateProductoDto.stock > 0;
    }

    Object.assign(producto, updateProductoDto);
    return this.productoRepository.save(producto);
  }

  async remove(id: string, emprendedorId: string): Promise<void> {
    const producto = await this.findOne(id);

    await this.validatePuestoOwner(producto.stallId, emprendedorId);

    await this.productoRepository.remove(producto);
  }

  async verificarStock(productoId: string, cantidad: number): Promise<boolean> {
    const producto = await this.findOne(productoId);
    return producto.stock >= cantidad && producto.isAvailable;
  }

  async descontarStock(productoId: string, cantidad: number): Promise<Producto> {
    const producto = await this.findOne(productoId);

    if (producto.stock < cantidad) {
      throw new BadRequestException('Stock insuficiente');
    }

    producto.stock -= cantidad;
    producto.isAvailable = producto.stock > 0;

    return this.productoRepository.save(producto);
  }

  async restaurarStock(productoId: string, cantidad: number): Promise<Producto> {
    const producto = await this.findOne(productoId);
    producto.stock += cantidad;
    producto.isAvailable = true;

    return this.productoRepository.save(producto);
  }

  private async validatePuestoOwner(stallId: string, emprendedorId: string): Promise<void> {
    const puestosServiceUrl =
      this.configService.get<string>('PUESTOS_SERVICE_URL') || 'http://localhost:3002';

    try {
      const response = await axios.get(`${puestosServiceUrl}/puestos/${stallId}`);

      if (!response.data) {
        throw new NotFoundException('Puesto no encontrado');
      }

      const puesto = response.data;

      // Validar que el puesto está activo o aprobado
      if (puesto.status !== 'activo' && puesto.status !== 'aprobado') {
        throw new BadRequestException('El puesto no está disponible para gestionar productos');
      }

      // Validar que el puesto pertenece al emprendedor
      if (puesto.ownerId !== emprendedorId) {
        throw new ForbiddenException('No tienes permiso para gestionar productos de este puesto');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException('Puesto no encontrado');
      }
      if (error.response?.status === 403) {
        throw new ForbiddenException('No tienes permiso para gestionar productos de este puesto');
      }
      throw error;
    }
  }
}

