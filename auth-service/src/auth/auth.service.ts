import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario, Rol } from '../entities/usuario.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ usuario: Usuario; token: string }> {
    const { email, password, fullName, role } = registerDto;

    // Verificar si el usuario ya existe
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (usuarioExistente) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const usuario = this.usuarioRepository.create({
      email,
      passwordHash: hashedPassword,
      fullName,
      role,
    });

    const usuarioGuardado = await this.usuarioRepository.save(usuario);

    // Generar token
    const payload = {
      sub: usuarioGuardado.id,
      email: usuarioGuardado.email,
      rol: usuarioGuardado.role,
    };
    const token = this.jwtService.sign(payload);

    // No retornar la contraseña
    const { passwordHash: _, ...usuarioSinPassword } = usuarioGuardado;

    return {
      usuario: usuarioSinPassword as Usuario,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ usuario: Usuario; token: string }> {
    const { email, password } = loginDto;

    // Buscar usuario
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, usuario.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.role,
    };
    const token = this.jwtService.sign(payload);

    // No retornar la contraseña
    const { passwordHash: _, ...usuarioSinPassword } = usuario;

    return {
      usuario: usuarioSinPassword as Usuario,
      token,
    };
  }

  async validateToken(token: string): Promise<{ valid: boolean; payload?: any }> {
    try {
      const payload = this.jwtService.verify(token);
      return { valid: true, payload };
    } catch (error) {
      return { valid: false };
    }
  }

  async findById(id: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
    });

    if (!usuario) {
      return null;
    }

    const { passwordHash: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword as Usuario;
  }

  async updateProfile(
    id: string,
    updateData: Partial<{ fullName: string; password: string }>,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Si se actualiza la contraseña, hashearla
    if (updateData.password) {
      usuario.passwordHash = await bcrypt.hash(updateData.password, 10);
    }

    if (updateData.fullName) {
      usuario.fullName = updateData.fullName;
    }

    const usuarioActualizado = await this.usuarioRepository.save(usuario);

    const { passwordHash: _, ...usuarioSinPassword } = usuarioActualizado;
    return usuarioSinPassword as Usuario;
  }
}

