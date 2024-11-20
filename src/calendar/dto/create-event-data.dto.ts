import {
  IsString,
  IsEmail,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from 'src/auth/entities/user.entity';

export class EventDataDto {
  @IsString()
  summary: string;

  @IsString()
  description: string;

  @IsDateString()
  start: string;

  @IsDateString()
  end: string;

  @IsEmail()
  attendeeEmail: string;
}

export class CreateEventDataDto {
  @ValidateNested()
  @Type(() => EventDataDto)
  eventData: EventDataDto;

  @ValidateNested()
  @Type(() => User)
  user: User;
}
