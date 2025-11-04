import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SchedulerConfigService {
  private readonly logger = new Logger(SchedulerConfigService.name);

  constructor(private readonly configService: ConfigService) {}

  getRedisHost(): string {
    this.logger.debug('Getting Redis Host');
    return this.configService.getOrThrow<string>('REDIS_HOST');
  }

  getRedisPort(): string {
    this.logger.debug('Getting Redis Port');
    return this.configService.getOrThrow<string>('REDIS_PORT');
  }

  getRedisPassword(): string | undefined {
    this.logger.debug('Getting Redis Password');
    return this.configService.get<string>('REDIS_PASSWORD');
  }

  getRedisTLSStatus(): boolean {
    this.logger.debug('Getting Redis TLS Status');
    return this.configService.get<boolean>('REDIS_TLS', false);
  }

  getBullMqPrefix(): string {
    this.logger.debug('Getting BullMQ Prefix');
    return this.configService.get<string>('BULL_PREFIX', 'astro');
  }

  getTestCronTab(): string {
    this.logger.debug('Getting TEST_CRONTAB Crontab');
    return this.configService.getOrThrow<string>('TEST_CRONTAB');
  }
}
