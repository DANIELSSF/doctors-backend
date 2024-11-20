import { Payment } from 'src/payments/entities/payment.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ name: 'google_tokens', type: 'jsonb', nullable: true })
  googleTokens: {
    access_token: string;
    refresh_token?: string;
    scope: string;
    token_type: string;
    expiry_date: number;
  };

  @Column()
  picture: string;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
