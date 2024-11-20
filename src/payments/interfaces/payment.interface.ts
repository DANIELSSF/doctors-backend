export interface CreatePaymentData {
  user_id: number;
  amount: number;
  payment_method: string;
  reference: string;
}
