import { IsEmail } from 'class-validator';

export class FreeBusyCalendarValidationDto {
  @IsEmail()
  targetEmail: string;
}
