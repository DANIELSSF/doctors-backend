import { Controller, Post, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { FreeBusyCalendarValidationDto } from './dto/search-freebusy-calendar.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('freebusy')
  create(@Body() freeBusyCalendarValidationDto: FreeBusyCalendarValidationDto) {
    return this.calendarService.getFreeBusy(freeBusyCalendarValidationDto);
  }
}
