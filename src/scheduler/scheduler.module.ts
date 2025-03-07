import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { TgBotModule } from '../tg-bot/tg-bot.module';
import { SubscriptionModule } from '../repository/subscription/subscription.module';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TgBotModule,
    SubscriptionModule,
    RepositoryModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule { }
