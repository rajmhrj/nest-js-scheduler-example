import { Body, Controller, Post } from '@nestjs/common';

import { ScheduleDelayedJobDto } from '../dto/schedule-delayed-job.dto';
import { DelayedSchedulerService } from '../services/delayed-scheduler.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(
    private readonly delayedSchedulerService: DelayedSchedulerService,
  ) {}

  @Post('delayed')
  async scheduleDelayedJob(@Body() dto: ScheduleDelayedJobDto) {
    const jobId = await this.delayedSchedulerService.addDelayedJob(dto.delayMs);

    return {
      success: true,
      message: `Delayed job scheduled successfully`,
      data: {
        jobId,
        delayMs: dto.delayMs,
        delaySeconds: (dto.delayMs / 1000).toFixed(1),
        willExecuteAt: new Date(Date.now() + dto.delayMs).toISOString(),
      },
    };
  }
}
