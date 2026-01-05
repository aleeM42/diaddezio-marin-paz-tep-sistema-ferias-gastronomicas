import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuestosService } from './puestos.service';
import { PuestosController } from './puestos.controller';
import { Puesto } from '../entities/puesto.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Puesto])],
  controllers: [PuestosController],
  providers: [PuestosService, JwtAuthGuard, RolesGuard],
  exports: [PuestosService],
})
export class PuestosModule {}

