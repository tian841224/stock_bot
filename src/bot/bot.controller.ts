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
  @UseGuards(BotGuard)
  async handleCallback(@Body() body: any) {
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

}
