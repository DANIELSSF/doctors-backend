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
import { Booking } from '../../calendar/entities/booking.entity';

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

  @ManyToOne(() => Booking, (booking) => booking.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['APPROVED', 'DECLINED', 'VOIDED', 'ERROR', 'PENDING'],
    nullable: false,
  })
  status: 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | 'PENDING';

  @Column({ type: 'text', nullable: false })
  reference: string;

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'text' })
  payment_method: string;
}
