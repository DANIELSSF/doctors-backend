import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { google } from 'googleapis';

import { FreeBusyCalendarValidationDto } from './dto/search-freebusy-calendar.dto';
import { User } from 'src/auth/entities/user.entity';
import { GoogleCredentials } from './interfaces';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async getFreeBusy(
    freeBusyCalendarValidationDto: FreeBusyCalendarValidationDto,
  ) {
    const { emailTarget, id } = freeBusyCalendarValidationDto;
    const user: User = await this.findOneUser(id);
    const { googleTokens } = user;
    this.logger.warn('User:', user);

    this.getBusyCalendar(googleTokens, emailTarget);
  }

  private async findOneUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new BadRequestException('User not found');
    return user;
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
      const response = await calendar.freebusy.query({
        requestBody: freeBusyRequest,
      });
      const busyTimes = response.data.calendars?.[emailTarget]?.busy || [];
      console.log(busyTimes);

      return { busyTimes };
    } catch (error) {
      this.logger.error('Error in FreeBusy query:', error);
      throw new BadRequestException('Error in FreeBusy query');
    }
  }
}
