import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { envs } from 'src/config/envs.config';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentData } from './interfaces/payment.interface';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class PaymentService {
  private readonly integritySecret = envs.wompi.integritySecret;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async generateIntegritySignature(
    reference: string,
    amountInCents: number,
    currency: string,
    user: User,
  ): Promise<string> {
    try {
      const data = `${reference}${amountInCents}${currency}${this.integritySecret}`;
      const hash = crypto.createHash('sha256').update(data).digest('hex');

      await this.createPayment({
        user_id: user.id,
        amount: amountInCents / 100, // Change (COP) cents to pesos
        payment_method: 'Wompi',
        reference: reference,
      });

      return hash;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error generating integrity signature',
      );
    }
  }

  createPayment(createPayment: CreatePaymentData) {
    return this.paymentRepository.save({
      ...createPayment,
      date: new Date(),
      status: 'PENDING',
    });
  }

  async updatePaymentStatus(
    reference: string,
    status: 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | 'PENDING',
    payment_method: string,
  ) {
    const payment = await this.paymentRepository.findOne({
      where: { reference },
    });
    if (payment) {
      payment.status = status;
      payment.payment_method = payment_method;
      await this.paymentRepository.save(payment);
    }
  }

  async getPaymentActive(user: User) {
    return await this.paymentRepository.find({
      where: { user, status: 'APPROVED', booking: null },
    });
  }
}
