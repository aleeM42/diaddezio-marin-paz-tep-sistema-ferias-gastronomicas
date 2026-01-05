import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PuestosService } from './puestos.service';
import { CreatePuestoDto } from '../dto/create-puesto.dto';
import { UpdatePuestoDto } from '../dto/update-puesto.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('puestos')
export class PuestosController {
  constructor(private readonly puestosService: PuestosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('emprendedor')
  create(@Body() createPuestoDto: CreatePuestoDto, @Request() req) {
    return this.puestosService.create(createPuestoDto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.puestosService.findAll();
  }

  @Get('activos')
  findActivos() {
    return this.puestosService.findActivos();
  }

  @Get('mis-puestos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('emprendedor')
  findByEmprendedor(@Request() req) {
    return this.puestosService.findByEmprendedor(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.puestosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('emprendedor')
  update(
    @Param('id') id: string,
    @Body() updatePuestoDto: UpdatePuestoDto,
    @Request() req,
  ) {
    return this.puestosService.update(id, updatePuestoDto, req.user.sub);
  }

  @Post(':id/aprobar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizador')
  aprobarPuesto(@Param('id') id: string) {
    return this.puestosService.aprobarPuesto(id);
  }

  @Post(':id/activar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizador')
  activarPuesto(@Param('id') id: string) {
    return this.puestosService.activarPuesto(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('emprendedor')
  remove(@Param('id') id: string, @Request() req) {
    return this.puestosService.remove(id, req.user.sub);
  }
}

