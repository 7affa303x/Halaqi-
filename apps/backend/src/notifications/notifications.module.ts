import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsProcessor } from './notifications.processor';

@Module({
  providers: [NotificationsGateway, NotificationsProcessor],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
