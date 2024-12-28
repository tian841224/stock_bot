import { Inject, Injectable } from '@nestjs/common';
import * as line from '@line/bot-sdk';
import { ReplyMessageRequest } from '@line/bot-sdk/dist/messaging-api/api';

@Injectable()
export class LineBotService {

      constructor(
        @Inject('LINE_CLIENT')
        private readonly lineClient: line.messagingApi.MessagingApiClient,
      ) { }
    
      async handleEvent(event: any): Promise<any> {
        if (event.type !== 'message' || event.message.type !== 'text') {
          return null;
        }
        let a = this.lineClient.getBotInfo();
        (await a).userId;
        switch (event.message.text) {
          case 'info':
            return this.replyText(event.replyToken,(await a).userId);
          case 'bye':
            return this.replyText(event.replyToken, 'Goodbye!');
          default:
            return this.replyText(event.replyToken, 'Sorry, I did not understand that.');
        }
      }
    
     private replyText(replyToken: string, text: string): Promise<any> {
        const message: ReplyMessageRequest = {
          replyToken,
          messages: [{ type: 'text', text }],
        };
    
        return this.lineClient.replyMessage(message);
     }
    
      getMiddleware() {
        return line.middleware({
          channelSecret: process.env.CHANNEL_SECRET,
        });
      }
}
