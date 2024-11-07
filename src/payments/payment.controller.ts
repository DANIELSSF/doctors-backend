import { Controller, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('generate-signature')
  generateSignature(
    @Query('reference') reference: string,
    @Query('amountInCents') amountInCents: number,
    @Query('currency') currency: string,
  ) {
    console.log('reference');
    const signature = this.paymentService.generateIntegritySignature(
      reference,
      amountInCents,
      currency,
    );
    return { signature };
  }
}
