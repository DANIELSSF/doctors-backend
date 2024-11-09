import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { calendar_v3, google } from 'googleapis';
import { google } from 'googleapis';

import { User } from 'src/auth/entities/user.entity';
import { GoogleCredentials } from './interfaces';
import { CreateEventDataDto } from './dto/create-event-data.dto';
import { Payment } from 'src/payments/entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private BookingRepository: Repository<Booking>,
  ) {}

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

  async createEvent(createEventDataDto: CreateEventDataDto) {
    const { eventData, user } = createEventDataDto;
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(user.googleTokens);

    //validate if has a payment with id_booking in null and status approved
    const payment = await this.paymentRepository.findOne({
      where: { booking: null, status: 'APPROVED', user },
    });

    if (!payment) {
      throw new BadRequestException('No approved payment found');
    }

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const event: calendar_v3.Schema$Event = {
      summary: eventData.summary,
      description: eventData.description,
      start: { dateTime: eventData.start, timeZone: 'America/Bogota' },
      end: { dateTime: eventData.end, timeZone: 'America/Bogota' },
      attendees: [{ email: eventData.attendeeEmail }],
    };

    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });
      this.logger.log(
        `Event created for ${eventData.attendeeEmail}: ${JSON.stringify(response.data)}`,
      );
      this.logger.log(`Creating booking for payment: ${payment.id}`);

      const booking = this.BookingRepository.create({
        date: new Date(eventData.start),
        professionalEmail: eventData.attendeeEmail,
        status: 'PENDING',
      });
      payment.booking = booking;
      await this.paymentRepository.save(payment);
      await this.BookingRepository.save(booking);

      return response.data;
    } catch (error) {
      this.logger.error(`Error creating event: ${error.message}`);
      throw new BadRequestException('Error creating calendar event');
    }
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
