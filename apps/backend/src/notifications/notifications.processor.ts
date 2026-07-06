import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationsGateway } from './notifications.gateway';

@Processor('notifications')
export class NotificationsProcessor {
  constructor(private readonly gateway: NotificationsGateway) {}

  @Process()
  async handleNotification(job: Job<{ userId: string; title: string; body: string; type: string }>): Promise<void> {
    this.gateway.sendToUser(job.data.userId, 'notification', {
      title: job.data.title,
      body: job.data.body,
      type: job.data.type,
      timestamp: new Date().toISOString(),
    });
  }
}
