import { PartialType } from '@nestjs/mapped-types';
import { CreateCalendarDto } from './search-freebusy-calendar.dto';

export class UpdateCalendarDto extends PartialType(CreateCalendarDto) {}
