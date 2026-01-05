import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Rol {
  CLIENTE = 'cliente',
  EMPRENDEDOR = 'emprendedor',
  ORGANIZADOR = 'organizador',
}

@Entity('users')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'role', type: 'varchar', length: 50 })
  role: Rol;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

