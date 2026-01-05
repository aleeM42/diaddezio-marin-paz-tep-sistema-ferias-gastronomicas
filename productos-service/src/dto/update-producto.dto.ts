import { IsString, IsNumber, IsOptional, Min, IsBoolean } from 'class-validator';

export class UpdateProductoDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

