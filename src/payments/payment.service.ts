import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { envs } from 'src/config/envs.config';

@Injectable()
export class PaymentService {
  private readonly integritySecret = envs.wompi.integritySecret;

  generateIntegritySignature(
    reference: string,
    amountInCents: number,
    currency: string,
  ): string {
    const data = `${reference}${amountInCents}${currency}${this.integritySecret}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
