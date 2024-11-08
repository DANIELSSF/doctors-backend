import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { FreeBusyCalendarValidationDto } from './dto/search-freebusy-calendar.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('freebusy')
  @HttpCode(HttpStatus.OK)
  generateFreeBusySchedule(
    @Body() freeBusyCalendarValidationDto: FreeBusyCalendarValidationDto,
    //  @GetUser() user: User
  ) {
    return this.calendarService.getFreeBusy(freeBusyCalendarValidationDto);
  }
}
