import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('tickets')
export class Ticket { // Este "export" é o que resolve os erros TS2459
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'OPEN' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid' })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ name: 'ownerId' })
  owner: User;
}