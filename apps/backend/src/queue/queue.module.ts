import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: import('@nestjs/config').ConfigService) => ({
        redis: configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379',
      }),
      inject: [import('@nestjs/config').ConfigService],
    }),
    BullModule.registerQueue({ name: 'notifications' }, { name: 'emails' }),
  ],
  providers: [QueueService],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
