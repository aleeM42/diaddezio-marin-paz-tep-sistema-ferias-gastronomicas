import { IsString, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsUUID()
  @IsNotEmpty()
  stallId: string;
}

