import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  Body,
} from '@nestjs/common';
import { BotService } from './bot.service';
import { BotGuard } from './bot.guard';
import { WebhookEvent, WebhookRequestBody } from '@line/bot-sdk';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) { }

  @Get('/hello')
  getHello(): string {
    return 'Test Hello World!';
  }

  @Post('/callback')
  async handleCallback(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      // 確保 events 存在
      const events = body.events;
      if (!events || events.length === 0) {
        return ;
      }
  
      // 使用 Promise.all 處理所有事件
      const results = await Promise.all(
        events.map(event => this.botService.handleEvent(event))
      );
  
      // 返回處理結果
      return ;
  
    } catch (error) {
      console.error(error);
      return ;
    }
  }

  // @Post('line-bot')
  // // @UseGuards(LineBotSignatureGuard)
  // async getHellos(@Body() req: WebhookRequestBody): Promise<string> {
  //   const events: WebhookEvent[] = req.events;

  //   if (events.length === 0) return;

  //   const event = events[0];
  //   if (event.type !== 'message' || event.message.type !== 'text') {
  //     return;
  //   }
  //   this.botService.handleEvent(event);
  //   return;
  // }

  private async parseRequestBody(req: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}
