import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FreeBusyCalendarValidationDto } from './dto/search-freebusy-calendar.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class CalendarService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async getFreeBusy(
    freeBusyCalendarValidationDto: FreeBusyCalendarValidationDto,
  ) {}
}
