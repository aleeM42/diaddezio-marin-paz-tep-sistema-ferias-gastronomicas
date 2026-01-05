import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DetallePedido } from './detalle-pedido.entity';

export enum EstadoPedido {
  PENDIENTE = 'pendiente',
  PREPARANDO = 'preparando',
  LISTO = 'listo',
  ENTREGADO = 'entregado',
}

@Entity('orders')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string; // Referencia al usuario cliente (sin FK)

  @Column({ name: 'stall_id', type: 'uuid' })
  stallId: string; // Referencia al puesto (sin FK)

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  status: EstadoPedido;

  @OneToMany(() => DetallePedido, (detalle) => detalle.pedido, { cascade: true })
  detalles: DetallePedido[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

