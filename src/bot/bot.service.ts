import { Injectable } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { messagingApi } from '@line/bot-sdk';

@Injectable()
export class BotService {
  private readonly client: messagingApi.MessagingApiClient;

  constructor() {
    this.client = new messagingApi.MessagingApiClient({
      channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    });
  }

  async sendTextMessage(userId: string, text: string): Promise<void> {
    const message: messagingApi.TextMessage = {
      type: 'text',
      text,
    };
    await this.client.pushMessage({
      to: userId,
      messages: [message],
    });
  }

  async handleEvent(event: any) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return null;
    }

    const echo: messagingApi.TextMessage = { 
      type: 'text', 
      text: event.message.text 
    };

    return this.client.replyMessage({
      replyToken: event.replyToken,
      messages: [echo]
    });
  }
}
