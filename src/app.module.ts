import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SchedulerModule } from './scheduler/scheduler.module';
import { AppConfigModule } from './app-config/app-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SchedulerModule,
    AppConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
