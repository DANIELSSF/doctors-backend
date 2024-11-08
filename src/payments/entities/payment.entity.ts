import { User } from 'src/auth/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
// Importa Booking cuando tengas su entidad definida
// import { Booking } from './booking.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Booking puede ser opcional en el momento de crear el pago, así que lo hacemos nullable
  @Column({ type: 'bigint', nullable: true })
  booking_id: number; // Relación pendiente de definir cuando se tenga la entidad Booking

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  //status text NOT NULL
  @Column({ type: 'text', nullable: false })
  status: string;

  @Column({ type: 'text', nullable: false })
  reference: string;

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'text' })
  payment_method: string;
}
