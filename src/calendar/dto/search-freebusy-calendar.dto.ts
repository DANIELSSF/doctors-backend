import { Type } from 'class-transformer';
import { IsEmail, IsNumber } from 'class-validator';

export class FreeBusyCalendarValidationDto {
  @IsEmail()
  emailTarget: string;

  @IsNumber()
  @Type(() => Number)
  id: number;
}
