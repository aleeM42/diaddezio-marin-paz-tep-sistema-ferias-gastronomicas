import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity('order_items')
export class DetallePedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  @Index()
  orderId: string;

  @ManyToOne(() => Pedido, (pedido) => pedido.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  pedido: Pedido;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string; // Referencia al producto (sin FK)

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'numeric', precision: 10, scale: 2 })
  unitPrice: number; // Snapshot del precio al momento del pedido
}

