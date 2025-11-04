import { IsNumber, IsPositive, Max } from 'class-validator';

export class ScheduleDelayedJobDto {
  @IsNumber()
  @IsPositive()
  @Max(3600000) // Max 1 hour (in milliseconds)
  delayMs: number;
}
