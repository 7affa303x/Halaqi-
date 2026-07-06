import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    @InjectQueue('emails') private readonly emailsQueue: Queue,
  ) {}

  async addNotification(data: { userId: string; title: string; body: string; type: string }): Promise<void> {
    await this.notificationsQueue.add(data, { attempts: 3, backoff: 5000 });
  }

  async addEmail(data: { to: string; subject: string; template: string; variables: Record<string, unknown> }): Promise<void> {
    await this.emailsQueue.add(data, { attempts: 3, backoff: 10000 });
  }
}
