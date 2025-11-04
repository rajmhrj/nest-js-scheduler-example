import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';

import { EQueue } from '../enums/queue.enum';
import { jobDetails } from '../consts/job-details.const';

@Processor(EQueue.delayed, { concurrency: 5, autorun: true })
export class DelayedProcessor extends WorkerHost {
  private readonly logger = new Logger(DelayedProcessor.name);

  constructor() {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case jobDetails[EQueue.delayed].name: {
        this.logger.log(
          `Executing delayed job ${job.id} - scheduled at: ${job.data.timestamp}`,
        );
        // Simulate some work
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.logger.log(`Delayed job ${job.id} completed successfully!`);
        break;
      }
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
        break;
    }
  }
}


