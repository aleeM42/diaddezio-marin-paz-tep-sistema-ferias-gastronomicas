import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  All,
  Req,
  Res,
  HttpException,
} from '@nestjs/common';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { GatewayService } from './gateway.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  // Auth routes
  @Post('auth/register')
  async register(@Body() body: any, @Req() req: ExpressRequest) {
    return this.gatewayService.proxyToAuth('POST', '/auth/register', body);
  }

  @Post('auth/login')
  async login(@Body() body: any) {
    return this.gatewayService.proxyToAuth('POST', '/auth/login', body);
  }

  @Post('auth/validate-token')
  async validateToken(@Body() body: any) {
    return this.gatewayService.proxyToAuth('POST', '/auth/validate-token', body);
  }

  @Get('auth/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: ExpressRequest) {
    return this.gatewayService.proxyToAuth('GET', '/auth/profile', null, {
      authorization: req.headers.authorization,
    });
  }

  @Put('auth/profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() body: any, @Req() req: ExpressRequest) {
    return this.gatewayService.proxyToAuth('PUT', '/auth/profile', body, {
      authorization: req.headers.authorization,
    });
  }

  // Puestos routes
  @Get('puestos')
  async getPuestos() {
    return this.gatewayService.proxyToPuestos('GET', '/puestos');
  }

  @Get('puestos/activos')
  async getPuestosActivos() {
    return this.gatewayService.proxyToPuestos('GET', '/puestos/activos');
  }

  @Get('puestos/:id')
  async getPuesto(@Param('id') id: string) {
    return this.gatewayService.proxyToPuestos('GET', `/puestos/${id}`);
  }

  @Post('puestos')
  @UseGuards(JwtAuthGuard)
  async createPuesto(@Body() body: any, @Req() req: ExpressRequest) {
    return this.gatewayService.proxyToPuestos('POST', '/puestos', body, {
      authorization: req.headers.authorization,
    });
  }

  @Patch('puestos/:id')
  @UseGuards(JwtAuthGuard)
  async updatePuesto(@Param('id') id: string, @Body() body: any, @Req() req: ExpressRequest) {
    return this.gatewayService.proxyToPuestos('PATCH', `/puestos/${id}`, body, {
      authorization: req.headers.authorization,
    });
  }

  @Post('puestos/:id/aprobar')
  @UseGuards(JwtAuthGuard)
  async aprobarPuesto(@Param('id') id: string, @Req() req: ExpressRequest) {
    return this.gatewayService.proxyToPuestos('POST', `/puestos/${id}/aprobar`, null, {
      authorization: req.headers.authorization,
    });
  }

  @Post('puestos/:id/activar')
  @UseGuards(JwtAuthGuard)
  async activarPuesto(@Param('id') id: string, @Req() req: ExpressRequest) {
    return this.gatewayService.proxyToPuestos('POST', `/puestos/${id}/activar`, null, {
      authorization: req.headers.authorization,
    });
  }

  @Delete('puestos/:id')
  @UseGuards(JwtAuthGuard)
  async deletePuesto(@Param('id') id: string, @Req() req: ExpressRequest) {
    return this.gatewayService.proxyToPuestos('DELETE', `/puestos/${id}`, null, {
      authorization: req.headers.authorization,
    });
  }

  @Get('puestos/mis-puestos')
  @UseGuards(JwtAuthGuard)
  async getMisPuestos(@Req() req: ExpressRequest) {
    return this.gatewayService.proxyToPuestos('GET', '/puestos/mis-puestos', null, {
      authorization: req.headers.authorization,
    });
  }

  // Productos routes
  @Get('productos')
  async getProductos(@Query() query: any) {
    return this.gatewayService.proxyToProductos('GET', '/productos', null, null, query);
  }

  @Get('productos/:id')
  async getProducto(@Param('id') id: string) {
    return this.gatewayService.proxyToProductos('GET', `/productos/${id}`);
  }

  @Get('productos/puesto/:stallId')
  async getProductosByPuesto(@Param('stallId') stallId: string) {
    return this.gatewayService.proxyToProductos('GET', `/productos/puesto/${stallId}`);
  }

  @Post('productos')
  @UseGuards(JwtAuthGuard)
  async createProducto(@Body() body: any, @Req() req: ExpressRequest) {
    return this.gatewayService.proxyToProductos('POST', '/productos', body, {
      authorization: req.headers.authorization,
    });
  }

  @Patch('productos/:id')
  @UseGuards(JwtAuthGuard)
  async updateProducto(@Param('id') id: string, @Body() body: any, @Req() req: ExpressRequest) {
    return this.gatewayService.proxyToProductos('PATCH', `/productos/${id}`, body, {
      authorization: req.headers.authorization,
    });
  }

  @Delete('productos/:id')
  @UseGuards(JwtAuthGuard)
  async deleteProducto(@Param('id') id: string, @Req() req: ExpressRequest) {
    return this.gatewayService.proxyToProductos('DELETE', `/productos/${id}`, null, {
      authorization: req.headers.authorization,
    });
  }

  // Pedidos routes
  @Post('pedidos')
  @UseGuards(JwtAuthGuard)
  async createPedido(@Body() body: any, @Req() req: ExpressRequest) {
    return this.gatewayService.proxyToPedidos('POST', '/pedidos', body, {
      authorization: req.headers.authorization,
    });
  }

  @Get('pedidos')
  @UseGuards(JwtAuthGuard)
  async getPedidos(@Req() req: ExpressRequest) {
    return this.gatewayService.proxyToPedidos('GET', '/pedidos', null, {
      authorization: req.headers.authorization,
    });
  }

  @Get('pedidos/mis-pedidos')
  @UseGuards(JwtAuthGuard)
  async getMisPedidos(@Req() req: ExpressRequest) {
    return this.gatewayService.proxyToPedidos('GET', '/pedidos/mis-pedidos', null, {
      authorization: req.headers.authorization,
    });
  }

  @Get('pedidos/:id')
  @UseGuards(JwtAuthGuard)
  async getPedido(@Param('id') id: string, @Req() req: ExpressRequest) {
    return this.gatewayService.proxyToPedidos('GET', `/pedidos/${id}`, null, {
      authorization: req.headers.authorization,
    });
  }

  @Patch('pedidos/:id/estado')
  @UseGuards(JwtAuthGuard)
  async updateEstadoPedido(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: ExpressRequest,
  ) {
    return this.gatewayService.proxyToPedidos('PATCH', `/pedidos/${id}/estado`, body, {
      authorization: req.headers.authorization,
    });
  }

  @Post('pedidos/:id/cancelar')
  @UseGuards(JwtAuthGuard)
  async cancelarPedido(@Param('id') id: string, @Req() req: ExpressRequest) {
    return this.gatewayService.proxyToPedidos('POST', `/pedidos/${id}/cancelar`, null, {
      authorization: req.headers.authorization,
    });
  }

  // Estadísticas del organizador
  @Get('estadisticas')
  @UseGuards(JwtAuthGuard)
  async getEstadisticas(@Req() req: ExpressRequest) {
    // Validar que el usuario es organizador
    if (req.user?.rol !== 'organizador') {
      throw new HttpException('Solo los organizadores pueden ver estadísticas', 403);
    }
    return this.gatewayService.getEstadisticas();
  }
}

