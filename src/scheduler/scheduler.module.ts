import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { EQueue } from './enums/queue.enum';
import { TestProcessor } from './processors/test.processor';
import { DelayedProcessor } from './processors/delayed.processor';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { TestSchedulerService } from './services/test-scheduler.service';
import { SchedulerController } from './controllers/scheduler.controller';
import { DelayedSchedulerService } from './services/delayed-scheduler.service';
import { SchedulerConfigService } from 'src/app-config/services/scheduler-config.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [SchedulerConfigService],
      useFactory: (config: SchedulerConfigService) => ({
        connection: {
          host: config.getRedisHost(),
          port: config.getRedisPort(),
          password: config.getRedisPassword(),
          maxRetriesPerRequest: null,
          enableReadyCheck: true,
        },
        prefix: config.getBullMqPrefix(),
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: 100,
          attempts: 2,
          backoff: { type: 'exponential', delay: 5000 },
        },
      }),
    }),
    BullModule.registerQueue(
      {
        name: EQueue.test,
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: 200,
          attempts: 2,
        },
      },
      {
        name: EQueue.delayed,
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: false,
          attempts: 1,
        },
      },
    ),
    AppConfigModule,
  ],
  controllers: [SchedulerController],
  providers: [
    TestSchedulerService,
    TestProcessor,
    DelayedSchedulerService,
    DelayedProcessor,
  ],
})
export class SchedulerModule {}
