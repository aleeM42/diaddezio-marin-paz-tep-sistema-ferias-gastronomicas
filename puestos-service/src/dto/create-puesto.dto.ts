import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePuestoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

