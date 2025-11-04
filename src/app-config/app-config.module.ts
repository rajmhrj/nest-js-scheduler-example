import { Module } from '@nestjs/common';

import { SchedulerConfigService } from './services/scheduler-config.service';

@Module({
  providers: [SchedulerConfigService],
  exports: [SchedulerConfigService],
})
export class AppConfigModule {}
