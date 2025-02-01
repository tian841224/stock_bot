import { Module } from '@nestjs/common';
import { LineBotService } from './line-bot.service';
import { LineBotController } from './line-bot.controller';
import { ConfigService } from '@nestjs/config';
import { messagingApi } from '@line/bot-sdk';
import { TwStockInfoModule } from 'src/tw-stock-info/tw-stock-info.module';
import { ImgurModule } from 'src/imgur/imgur.module';

@Module({
  imports: [TwStockInfoModule,ImgurModule],
  controllers: [LineBotController],
  providers: [
    {
    provide: 'LINE_CLIENT',
    useFactory: (configService: ConfigService) => {
      return new messagingApi.MessagingApiClient({
        channelAccessToken: configService.get<string>('CHANNEL_ACCESS_TOKEN'),
      });
    },
    inject: [ConfigService]
  }, LineBotService],
})
export class LineBotModule { }
