import { User } from 'src/auth/entities/user.entity';

export interface CreatePaymentData {
  user_id: User;
  amount: number;
  payment_method: string;
  reference: string;
}
