import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { FreeBusyCalendarValidationDto } from './dto/search-freebusy-calendar.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

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
}
