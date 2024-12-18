import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BotService } from './bot.service';
import { LineGuardGuard } from './line_guard/line_guard.guard';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) { }

  @Post()
  @UseGuards(LineGuardGuard)
  async handleWebhook(@Body() body: any) {
    const results = await Promise.all(
      body.events.map(event => this.botService.handleEvent(event))
    );
    return results;
  }

  // @Post('callback')
  // async handleWebhook(@Req() req, @Res() res) {
  //   try {
  //     const events = req.body.events;
  //     const results = await Promise.all(
  //       events.map(async (event: any) => {
  //         // 假設收到的是文字訊息事件，則回覆相同的文字
  //         if (event.type === 'message' && event.message.type === 'text') {
  //           // await this.botService.replyMessage(event.replyToken, event.message.text);
  //         }
  //         return null;
  //       }),
  //     );
  //     return res.json(results);
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(500).end();
  //   }
  // }
}
