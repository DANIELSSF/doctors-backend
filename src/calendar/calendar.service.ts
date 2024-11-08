import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';

import { User } from 'src/auth/entities/user.entity';
import { GoogleCredentials } from './interfaces';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  async getFreeBusy(freeBusyCalendarValidationDto: {
    targetEmail: string;
    user: User;
  }) {
    const { targetEmail, user } = freeBusyCalendarValidationDto;
    const { googleTokens } = user;

    if (!googleTokens) {
      throw new BadRequestException('Google tokens not found for user');
    }

    this.logger.log(`Fetching busy calendar for: ${targetEmail}`);
    return this.getBusyCalendar(googleTokens, targetEmail);
  }

  private async getBusyCalendar(
    googleCredentials: GoogleCredentials,
    targetEmail: string,
  ) {
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(googleCredentials);

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const freeBusyRequest = {
      timeMin: new Date().toISOString(),
      timeMax: new Date(
        new Date().setDate(new Date().getDate() + 7),
      ).toISOString(),
      items: [{ id: targetEmail }],
    };

    try {
      const response = await calendar.freebusy.query({
        requestBody: freeBusyRequest,
      });

      this.logger.log(
        `FreeBusy response for ${targetEmail}: ${JSON.stringify(response.data.calendars)}`,
      );

      const busyTimes = response.data.calendars?.[targetEmail]?.busy || [];
      this.logger.log(
        `Busy times for ${targetEmail}: ${JSON.stringify(busyTimes)}`,
      );

      return { busyTimes };
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException('Error in FreeBusy query');
    }
  }
}
