import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { envs } from './config/envs.config';
import { User } from './auth/entities/user.entity';
import { CalendarModule } from './calendar/calendar.module';
import { PaymentModule } from './payments/payment.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.db.host,
      port: envs.db.port,
      username: envs.db.username,
      password: envs.db.password,
      database: envs.db.name,
      entities: [User],
      synchronize: false,
      autoLoadEntities: true,
    }),
    AuthModule,
    CalendarModule,
    PaymentModule,
    WebhookModule,
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class AppModule {}
