import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Get('generate-signature')
  generateSignature(
    @Query('reference') reference: string,
    @Query('amountInCents') amountInCents: number,
    @Query('currency') currency: string,
    @GetUser() user: User,
  ) {
    const signature = this.paymentService.generateIntegritySignature(
      reference,
      amountInCents,
      currency,
      user,
    );
    return { signature };
  }

  @UseGuards(JwtAuthGuard)
  @Get('payment-active')
  async paymentActive(@GetUser() user: User) {
    return this.paymentService.getPaymentActive(user);
  }
}
