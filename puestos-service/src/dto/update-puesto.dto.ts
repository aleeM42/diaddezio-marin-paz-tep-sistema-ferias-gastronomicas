import { IsString, IsOptional, IsEnum } from 'class-validator';
import { EstadoPuesto } from '../entities/puesto.entity';

export class UpdatePuestoDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(EstadoPuesto)
  @IsOptional()
  status?: EstadoPuesto;
}

