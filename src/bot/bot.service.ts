import { Inject, Injectable } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import * as line from '@line/bot-sdk';
import { Message, ReplyMessageRequest } from '@line/bot-sdk/dist/messaging-api/api';

@Injectable()
export class BotService {

  constructor(
    @Inject('LINE_CLIENT')
    private readonly lineClient: line.messagingApi.MessagingApiClient,
  ) { }

  async handleEvent(event: any): Promise<any> {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return null;
    }

    // Echo back the received text message
    const echo: Message = { type: 'text', text: event.message.text };

    return this.lineClient.replyMessage({ replyToken: event.replyToken, messages: [echo] });
  }

  // response 會是 ReplyMessageResponse 類型
  getMiddleware() {
    return line.middleware({
      channelSecret: process.env.CHANNEL_SECRET,
    });
  }
}
