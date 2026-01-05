import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from '../dto/create-pedido.dto';
import { UpdateEstadoPedidoDto } from '../dto/update-estado-pedido.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('cliente')
  create(@Body() createPedidoDto: CreatePedidoDto, @Request() req) {
    return this.pedidosService.create(createPedidoDto, req.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizador')
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get('mis-pedidos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('cliente')
  findByCliente(@Request() req) {
    return this.pedidosService.findByCliente(req.user.sub);
  }

  @Get('puesto/:stallId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('emprendedor', 'organizador')
  findByPuesto(@Param('stallId') stallId: string) {
    return this.pedidosService.findByPuesto(stallId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.pedidosService.findOne(id);
  }

  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('emprendedor', 'cliente', 'organizador')
  updateEstado(
    @Param('id') id: string,
    @Body() updateEstadoDto: UpdateEstadoPedidoDto,
    @Request() req,
  ) {
    return this.pedidosService.updateEstado(
      id,
      updateEstadoDto,
      req.user.sub,
      req.user.rol,
    );
  }

  @Post(':id/cancelar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('cliente')
  cancelarPedido(@Param('id') id: string, @Request() req) {
    return this.pedidosService.cancelarPedido(id, req.user.sub);
  }
}

