import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { PaymentModule } from 'src/payments/payment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [PaymentModule, TypeOrmModule.forFeature([Booking])],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService, TypeOrmModule],
})
export class CalendarModule {}
