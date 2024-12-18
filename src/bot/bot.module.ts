import { Module } from '@nestjs/common';
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
        return new messagingApi.MessagingApiClient({
          channelAccessToken: configService.get<string>('CHANNEL_ACCESS_TOKEN'),
        });
      },
      inject: [ConfigService]
    },
    BotService
  ],
  exports: ['LINE_CLIENT'],
})
export class BotModule {}
