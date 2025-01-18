import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LineBotService } from './line-bot.service';
import { LineBotGuard } from './line-bot.guard';

@Controller('lineBot')
export class LineBotController {
  constructor(private readonly lineBotService: LineBotService) { }

  @Post('/callback')
  @UseGuards(LineBotGuard)
  async handleCallback(@Body() body: any) {
    try {
      // 確保 events 存在
      const events = body.events;
      if (!events || events.length === 0) {
        return;
      }

      // 使用 Promise.all 處理所有事件
      await Promise.all(
        events.map(event => this.lineBotService.handleEvent(event))
      );
    } catch (error) {
      console.error(error);
      return;
    }
  }
}
