import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrowserModule } from './browser/browser.module';
import { LineBotModule } from './line-bot/line-bot.module';
import { UsStockInfoModule } from './us-stock-info/us-stock-info.module';
import { TwStockInfoModule } from './tw-stock-info/tw-stock-info.module';
import { TgBotModule } from './tg-bot/tg-bot.module';
import { ImgurModule } from './imgur/imgur.module';
import { NotificationHistoryModule } from './repository/notification-history/notification-history.module';
import { RepositoryModule } from './repository/repository.module';
import { UserModule } from './repository/user/user.module';
import { SubscriptionModule } from './repository/subscription/subscription.module';
import { SubscriptionStockModule } from './repository/subscription-stock/subscription-stock.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // 根據 process.env.NODE_ENV 決定要載入哪個設定檔，若沒有設定則讀取預設的 .env 檔案
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}` // 如果有設定 NODE_ENV，則載入對應的檔案
        : '.env', // 沒有設定時，讀取預設的 .env 檔案
      isGlobal: true, // 全域使用
    }),
    BrowserModule,
    LineBotModule,
    TgBotModule,
    UsStockInfoModule,
    TwStockInfoModule,
    ImgurModule,
    RepositoryModule,
    UserModule,
    SubscriptionModule,
    SubscriptionStockModule,
    NotificationHistoryModule,
    SchedulerModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
