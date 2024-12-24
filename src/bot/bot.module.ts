import { Logger, Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { ConfigService } from '@nestjs/config';
import { messagingApi } from '@line/bot-sdk';

@Module({
  controllers: [BotController],
  providers: [
    {
      provide: 'LINE_CLIENT',
      useFactory: (configService: ConfigService) => {
        // log
        Logger.debug(configService.get<string>('CHANNEL_ACCESS_TOKEN'), 'CHANNEL_ACCESS_TOKEN');
        Logger.debug(configService.get<string>('CHANNEL_SECRET'), 'CHANNEL_SECRET');
        return new messagingApi.MessagingApiClient({
          channelAccessToken: configService.get<string>('CHANNEL_ACCESS_TOKEN'),
        });
      },
      inject: [ConfigService]
    },
    BotService
  ],
  exports: ['LINE_CLIENT',BotService],
})
export class BotModule { }
