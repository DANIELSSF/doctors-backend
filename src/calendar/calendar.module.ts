import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CalendarController],
  providers: [CalendarService],
  imports: [AuthModule],
})
export class CalendarModule {}
