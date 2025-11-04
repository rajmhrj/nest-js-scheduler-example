import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';

import { EQueue } from '../enums/queue.enum';
import { jobDetails } from '../consts/job-details.const';

@Processor(EQueue.test, { concurrency: 1, autorun: true }) // Runs once on initialization
export class TestProcessor extends WorkerHost {
  private readonly logger = new Logger(TestProcessor.name);

  constructor() {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case jobDetails[EQueue.test].name: {
        this.logger.log('Executing test job');
        // Simulate some work
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.logger.log('Test job completed successfully!');
        break;
      }
      default:
        break;
    }
  }
}
