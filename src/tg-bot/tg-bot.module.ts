import { Module } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TgBotController } from './tg-bot.controller';
import { BrowserModule } from '../browser/browser.module';
import { RepositoryModule } from 'src/repository/repository.module';

@Module({
  imports: [
    RepositoryModule,
    BrowserModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
        launchOptions: {
          webhook: {
            domain: configService.get<string>('TELEGRAM_BOT_WEBHOOK_DOMAIN'),
            hookPath: configService.get<string>('TELEGRAM_BOT_WEBHOOK_PATH'),
            secretToken: configService.get<string>('TELEGRAM_BOT_SECRET_TOKEN'),
            // port: configService.get<number>('TELEGRAM_BOT_WEBHOOK_PORT'),
          },
        }
      }),
      inject: [ConfigService],
    })
  ],
  providers: [TgBotService],
  controllers: [TgBotController],
  exports: [TgBotService]
})
export class TgBotModule { }
