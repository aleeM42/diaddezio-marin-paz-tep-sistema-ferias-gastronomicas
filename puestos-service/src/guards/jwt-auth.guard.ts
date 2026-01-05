import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.substring(7);
    const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';

    try {
      const response = await axios.post(`${authServiceUrl}/auth/validate-token`, {
        token,
      });

      if (!response.data.valid) {
        throw new UnauthorizedException('Token inválido');
      }

      request.user = response.data.payload;
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Token inválido');
      }
      throw new UnauthorizedException('Error al validar token');
    }
  }
}

