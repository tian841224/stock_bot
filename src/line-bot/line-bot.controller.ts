import { Body, Controller, HttpException, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common';
import { LineBotService } from './line-bot.service';
import { LineBotGuard } from './line-bot.guard';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('lineBot')
export class LineBotController {
  private readonly logger = new Logger(LineBotController.name);
  constructor(private readonly lineBotService: LineBotService) { }

  @Post('/callback')
  @ApiExcludeEndpoint()
  @UseGuards(LineBotGuard)
  async handleCallback(@Body() body: any) {
    try {
      // 確保 events 存在
      const events = body.events;
      if (!events || events.length === 0) {
        return HttpStatus.OK;
      }

      // 使用 Promise.all 處理所有事件
      await Promise.all(
        events.map(event => this.lineBotService.handleEvent(event))
      );
      return HttpStatus.OK;

    } catch (error) {
      this.logger.error(error);
      // 非預期錯誤回傳 200，避免 LINE 重試
      return HttpStatus.OK;
    }
  }
}
