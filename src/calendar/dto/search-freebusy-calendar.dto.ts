import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class FreeBusyCalendarValidationDto {
  @IsEmail()
  emailTarget: string;

  @IsNumber()
  id: number;
}
