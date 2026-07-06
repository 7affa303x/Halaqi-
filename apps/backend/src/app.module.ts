import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BarbershopsModule } from './barbershops/barbershops.module';
import { ServicesModule } from './services/services.module';
import { BarbersModule } from './barbers/barbers.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UploadModule } from './upload/upload.module';
import { QueueModule } from './queue/queue.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    BarbershopsModule,
    ServicesModule,
    BarbersModule,
    AppointmentsModule,
    ReviewsModule,
    UploadModule,
    QueueModule,
    NotificationsModule,
    HealthModule,
  ],
})
export class AppModule {}
