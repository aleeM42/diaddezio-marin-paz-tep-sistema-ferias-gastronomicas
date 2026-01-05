import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Puesto, EstadoPuesto } from '../entities/puesto.entity';
import { CreatePuestoDto } from '../dto/create-puesto.dto';
import { UpdatePuestoDto } from '../dto/update-puesto.dto';

@Injectable()
export class PuestosService {
  constructor(
    @InjectRepository(Puesto)
    private puestoRepository: Repository<Puesto>,
  ) {}

  async create(createPuestoDto: CreatePuestoDto, emprendedorId: string): Promise<Puesto> {
    const puesto = this.puestoRepository.create({
      ...createPuestoDto,
      ownerId: emprendedorId,
      status: EstadoPuesto.PENDIENTE,
    });

    return this.puestoRepository.save(puesto);
  }

  async findAll(): Promise<Puesto[]> {
    return this.puestoRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findActivos(): Promise<Puesto[]> {
    return this.puestoRepository.find({
      where: { status: EstadoPuesto.ACTIVO },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Puesto> {
    const puesto = await this.puestoRepository.findOne({
      where: { id },
    });

    if (!puesto) {
      throw new NotFoundException('Puesto no encontrado');
    }

    return puesto;
  }

  async findByEmprendedor(emprendedorId: string): Promise<Puesto[]> {
    return this.puestoRepository.find({
      where: { ownerId: emprendedorId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updatePuestoDto: UpdatePuestoDto,
    emprendedorId: string,
  ): Promise<Puesto> {
    const puesto = await this.findOne(id);

    // Solo el dueño puede actualizar
    if (puesto.ownerId !== emprendedorId) {
      throw new ForbiddenException('No tienes permiso para actualizar este puesto');
    }

    // Validar transiciones de estado
    if (updatePuestoDto.status) {
      this.validateEstadoTransition(puesto.status, updatePuestoDto.status);
    }

    Object.assign(puesto, updatePuestoDto);
    return this.puestoRepository.save(puesto);
  }

  async aprobarPuesto(id: string): Promise<Puesto> {
    const puesto = await this.findOne(id);

    if (puesto.status !== EstadoPuesto.PENDIENTE) {
      throw new BadRequestException('Solo se pueden aprobar puestos pendientes');
    }

    puesto.status = EstadoPuesto.APROBADO;
    return this.puestoRepository.save(puesto);
  }

  async activarPuesto(id: string): Promise<Puesto> {
    const puesto = await this.findOne(id);

    if (puesto.status !== EstadoPuesto.APROBADO) {
      throw new BadRequestException('Solo se pueden activar puestos aprobados');
    }

    puesto.status = EstadoPuesto.ACTIVO;
    return this.puestoRepository.save(puesto);
  }

  async remove(id: string, emprendedorId: string): Promise<void> {
    const puesto = await this.findOne(id);

    if (puesto.ownerId !== emprendedorId) {
      throw new ForbiddenException('No tienes permiso para eliminar este puesto');
    }

    await this.puestoRepository.remove(puesto);
  }

  async validatePuesto(id: string): Promise<{ valid: boolean; puesto?: Puesto }> {
    try {
      const puesto = await this.findOne(id);
      return {
        valid: puesto.status === EstadoPuesto.ACTIVO,
        puesto,
      };
    } catch (error) {
      return { valid: false };
    }
  }

  async validatePuestoOwner(id: string, emprendedorId: string): Promise<boolean> {
    try {
      const puesto = await this.findOne(id);
      return puesto.ownerId === emprendedorId;
    } catch (error) {
      return false;
    }
  }

  private validateEstadoTransition(currentEstado: EstadoPuesto, newEstado: EstadoPuesto): void {
    const validTransitions: Record<EstadoPuesto, EstadoPuesto[]> = {
      [EstadoPuesto.PENDIENTE]: [EstadoPuesto.APROBADO],
      [EstadoPuesto.APROBADO]: [EstadoPuesto.ACTIVO],
      [EstadoPuesto.ACTIVO]: [],
    };

    if (!validTransitions[currentEstado]?.includes(newEstado)) {
      throw new BadRequestException(
        `Transición de estado inválida: ${currentEstado} -> ${newEstado}`,
      );
    }
  }
}

