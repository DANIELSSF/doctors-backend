import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'text', nullable: false })
  professionalEmail: string;

  @Column({ type: 'timestamp', nullable: false })
  date: Date;

  @Column({ type: 'text', nullable: false })
  status: string;
}
