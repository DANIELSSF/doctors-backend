import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { google } from 'googleapis';

import { User } from 'src/auth/entities/user.entity';
import { GoogleCredentials } from './interfaces';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  async getFreeBusy(freeBusyCalendarValidationDto: {
    emailTarget: string;
    user: User;
  }) {
    const { emailTarget, user } = freeBusyCalendarValidationDto;
    const { googleTokens } = user;

    if (!googleTokens) {
      throw new BadRequestException('Google tokens not found for user');
    }

    this.logger.log(`Fetching busy calendar for: ${emailTarget}`);
    return this.getBusyCalendar(googleTokens, emailTarget);
  }

  private async getBusyCalendar(
    googleCredentials: GoogleCredentials,
    emailTarget: string,
  ) {
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(googleCredentials);

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const freeBusyRequest = {
      timeMin: new Date().toISOString(),
      timeMax: new Date(
        new Date().setDate(new Date().getDate() + 7),
      ).toISOString(),
      items: [{ id: emailTarget }],
    };

    try {
      console.log('FreeBusy request:', freeBusyRequest);
      const response = await calendar.freebusy.query({
        requestBody: freeBusyRequest,
      });

      this.logger.log(
        `FreeBusy response for ${emailTarget}: ${JSON.stringify(response.data.calendars)}`,
      );

      const busyTimes = response.data.calendars?.[emailTarget]?.busy || [];
      this.logger.log(
        `Busy times for ${emailTarget}: ${JSON.stringify(busyTimes)}`,
      );

      return { busyTimes };
    } catch (error) {
      console.log(error.message);
      // this.logger.error(error.message);
      throw new BadRequestException('Error in FreeBusy query');
    }
  }
}
