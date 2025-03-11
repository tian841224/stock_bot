import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { TgBotModule } from '../tg-bot/tg-bot.module';
import { SubscriptionModule } from '../repository/subscription/subscription.module';
import { RepositoryModule } from '../repository/repository.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    TgBotModule,
    SubscriptionModule,
    RepositoryModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule { }
