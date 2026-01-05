import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { Rol } from '../entities/usuario.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(Rol)
  role: Rol;
}

