import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  InternalServerErrorException,
  Get,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { FreeBusyCalendarValidationDto } from './dto/search-freebusy-calendar.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { EventDataDto } from './dto/create-event-data.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @UseGuards(JwtAuthGuard)
  @Post('freebusy')
  @HttpCode(HttpStatus.OK)
  generateFreeBusySchedule(
    @Body() freeBusyCalendarValidationDto: FreeBusyCalendarValidationDto,
    @GetUser() user: User,
  ) {
    const { emailTarget } = freeBusyCalendarValidationDto;
    return this.calendarService.getFreeBusy({ emailTarget, user });
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('schedule')
  async scheduleAppointment(
    @Body() eventDataDto: EventDataDto,
    @GetUser() user: User,
  ) {
    try {
      const event = await this.calendarService.createEvent({
        eventData: eventDataDto,
        user,
      });
      return event;
    } catch (error) {
      console.error('Error to Created Appointment', error);
      throw new InternalServerErrorException('Error to Created Appointment');
    }
  }
}
