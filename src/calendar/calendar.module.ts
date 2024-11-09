import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { PaymentModule } from 'src/payments/payment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PaymentModule, TypeOrmModule.forFeature([Booking])],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService, TypeOrmModule],
  imports: [AuthModule],
})
export class CalendarModule {}
