// backend/src/webhook/webhook.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { Transaction } from './dto/data-pay.dto';
import { PaymentService } from 'src/payments/payment.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly paymentService: PaymentService) {}
  @Post()
  handleWebhook(@Body() data: any) {
    const transaction: Transaction = data.data.transaction;

    // APPROVED: accepted transaction.
    // DECLINED: declined transaction.
    // VOIDED: anuled transaction (only applies in payment with card).
    // ERROR: internal specific error of the payment method.
    switch (transaction.status) {
      case 'APPROVED':
        this.paymentService.updatePaymentStatus(
          transaction.reference,
          'APPROVED',
          transaction.payment_method_type,
        );
        break;
      case 'DECLINED':
        this.paymentService.updatePaymentStatus(
          transaction.reference,
          'DECLINED',
          transaction.payment_method_type,
        );
        break;
      case 'VOIDED':
        this.paymentService.updatePaymentStatus(
          transaction.reference,
          'VOIDED',
          transaction.payment_method_type,
        );
        break;
      case 'ERROR':
        this.paymentService.updatePaymentStatus(
          transaction.reference,
          'ERROR',
          transaction.payment_method_type,
        );
        break;
    }
  }
}
