import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';
import { FilterProductosDto } from '../dto/filter-productos.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('emprendedor')
  create(@Body() createProductoDto: CreateProductoDto, @Request() req) {
    return this.productosService.create(createProductoDto, req.user.sub);
  }

  @Get()
  findAll(@Query() filters: FilterProductosDto) {
    return this.productosService.findAll(filters);
  }

  @Get('puesto/:stallId')
  findByPuesto(@Param('stallId') stallId: string) {
    return this.productosService.findByPuesto(stallId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('emprendedor')
  update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
    @Request() req,
  ) {
    return this.productosService.update(id, updateProductoDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('emprendedor')
  remove(@Param('id') id: string, @Request() req) {
    return this.productosService.remove(id, req.user.sub);
  }

  @Post(':id/descontar-stock')
  async descontarStock(
    @Param('id') id: string,
    @Body() body: { cantidad: number },
  ) {
    return this.productosService.descontarStock(id, body.cantidad);
  }

  @Post(':id/restaurar-stock')
  async restaurarStock(
    @Param('id') id: string,
    @Body() body: { cantidad: number },
  ) {
    return this.productosService.restaurarStock(id, body.cantidad);
  }
}

