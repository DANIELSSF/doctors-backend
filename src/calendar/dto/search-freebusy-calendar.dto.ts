import { IsEmail } from 'class-validator';

export class FreeBusyCalendarValidationDto {
  @IsEmail()
  emailTarget: string;
}

