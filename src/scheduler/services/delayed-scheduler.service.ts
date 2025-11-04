import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';

import { EQueue } from '../enums/queue.enum';
import { jobDetails } from '../consts/job-details.const';

@Injectable()
export class DelayedSchedulerService {
  private readonly logger = new Logger(DelayedSchedulerService.name);

  constructor(
    @InjectQueue(EQueue.delayed)
    private readonly queue: Queue<any, any, string>,
  ) {}

  async addDelayedJob(delayMs: number): Promise<string> {
    const name = jobDetails[EQueue.delayed].name;
    const job = await this.queue.add(
      name,
      {
        timestamp: new Date().toISOString(),
        delayMs,
      },
      {
        delay: delayMs,
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    this.logger.log(
      `Added delayed job with ID ${job.id} - will execute in ${delayMs}ms (${(delayMs / 1000).toFixed(1)}s)`,
    );

    return job.id || 'unknown';
  }
}
