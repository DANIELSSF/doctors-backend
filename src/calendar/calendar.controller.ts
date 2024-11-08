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
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { GoogleCredentialAuth } from 'src/auth/guards/google-token.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/entities/user.entity';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @UseGuards(JwtAuthGuard, GoogleCredentialAuth)
  @Post('freebusy')
  @HttpCode(HttpStatus.OK)
  generateFreeBusySchedule(
    @Body() freeBusyCalendarValidationDto: FreeBusyCalendarValidationDto,
    @GetUser() user: User,
  ) {
    const { targetEmail } = freeBusyCalendarValidationDto;
    return this.calendarService.getFreeBusy({ targetEmail, user });
  }
}
