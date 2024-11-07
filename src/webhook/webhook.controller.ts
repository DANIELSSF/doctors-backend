// backend/src/webhook/webhook.controller.ts
import { Controller, Post, Body } from '@nestjs/common';

@Controller('webhook')
export class WebhookController {
  @Post()
  handleWebhook(@Body() data: any) {
    const transaction = data.transaction;
    console.log(data);

    // if (transaction.status === 'APPROVED') {
    //   console.log(`Pago aprobado para referencia: ${transaction.reference}`);
    //   // Lógica para desbloquear el recurso
    // }
  }
}
