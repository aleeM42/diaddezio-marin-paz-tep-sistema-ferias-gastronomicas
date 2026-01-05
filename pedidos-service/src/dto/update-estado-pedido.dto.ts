import { IsEnum } from 'class-validator';
import { EstadoPedido } from '../entities/pedido.entity';

export class UpdateEstadoPedidoDto {
  @IsEnum(EstadoPedido)
  estado: EstadoPedido;
}

