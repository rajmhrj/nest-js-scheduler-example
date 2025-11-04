import { InjectQueue } from '@nestjs/bullmq';
import { Queue, RepeatOptions } from 'bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { EQueue } from '../enums/queue.enum';
import { jobDetails } from '../consts/job-details.const';
import { SchedulerConfigService } from 'src/app-config/services/scheduler-config.service';

@Injectable()
export class TestSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(TestSchedulerService.name);

  constructor(
    @InjectQueue(EQueue.test) private readonly queue: Queue,
    private readonly schedulerConfigSerivce: SchedulerConfigService,
  ) {}

  async onModuleInit() {
    await this.ensureRepeatJob();
  }

  private async ensureRepeatJob() {
    const name = jobDetails[EQueue.test].name;
    const jobId = jobDetails[EQueue.test].id;

    const desired: RepeatOptions = {
      pattern: this.schedulerConfigSerivce.getTestCronTab(),
      tz: 'UTC',
    };
    const repeats = await this.queue.getJobSchedulers();
    let removedCount = 0;
    for (const r of repeats) {
      const sameJob = r.name === name;
      const sameId = r.key?.includes(`:${jobId}:`);
      const patternMatches = r.pattern === desired.pattern;
      const tzMatches = (r.tz || '') === (desired.tz || '');
      if (sameJob && sameId) {
        if (!(patternMatches && tzMatches)) {
          this.logger.warn(
            `Removing stale repeatable with old pattern: ${r.key} (pattern: ${r.pattern}, tz: ${r.tz || 'default'})`,
          );
        } else {
          this.logger.log(
            `Removing existing repeatable to reapply with current config: ${r.key} (pattern: ${r.pattern}, tz: ${r.tz || 'default'})`,
          );
        }
        await this.queue.removeJobScheduler(r.key);
        removedCount++;
      }
    }
    if (removedCount > 0) {
      this.logger.log(
        `Removed ${removedCount} existing repeatable(s). Adding new repeat job '${name}' → ${desired.pattern} (${desired.tz})`,
      );
    } else {
      this.logger.log(
        `Adding repeat job '${name}' → ${desired.pattern} (${desired.tz})`,
      );
    }
    await this.queue.add(
      name,
      {},
      {
        jobId,
        repeat: desired,
        removeOnComplete: true,
      },
    );
  }
}
