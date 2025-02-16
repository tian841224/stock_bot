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
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationHistoryModule } from './repository/notification-history/notification-history.module';
import { RepositoryModule } from './repository/repository.module';
import { UserModule } from './repository/user/user.module';
import { SubscriptionModule } from './repository/subscription/subscription.module';
import { SubscriptionStockModule } from './repository/subscription-stock/subscription-stock.module';

@Module({
  imports: [
    // 動態設定 TypeORM 連線
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // 根據環境變數決定使用哪種資料庫
        const dbType = config.get<string>('DB_TYPE');

        // if (dbType === 'mysql') {
        //   return {
        //     type: 'mysql' as const,
        //     host: config.get<string>('MYSQL_HOST'),
        //     port: config.get<number>('MYSQL_PORT'),
        //     username: config.get<string>('MYSQL_USER'),
        //     password: config.get<string>('MYSQL_PASS'),
        //     database: config.get<string>('MYSQL_DB'),
        //     entities: [__dirname + '/**/model/entity/*.entity{.ts,.js}'],
        //     synchronize: false, // 生產環境請務必關閉
        //   };
        // } else {
        //   // 預設使用 sqlite
          return {
            type: 'sqlite' as const,
            database: config.get<string>('SQLITE_DB') || 'stock-bot.db',
            entities: [__dirname + '/**/model/entity/*.entity{.ts,.js}'],
            synchronize: true, // 開發階段使用，自動同步實體
        //   };
        }
      },
    }),
    ConfigModule.forRoot({
      // 根據 process.env.NODE_ENV 決定要載入哪個設定檔，預設為 development
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
