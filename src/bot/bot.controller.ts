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

@Controller()
export class BotController {
  constructor(private readonly botService: BotService) { }

  @Get('hello')
  getHello(): string {
    return 'Test Hello World!';
  }

  @Post()
  // @UseGuards(BotGuard)  // 替代 line.middleware(config)
  async handleCallback(@Req() req: any, @Res() res: any) {
    try {

      const events = req.events;

      if (events.length === 0) return;

      const event = events[0];
      if (event.type !== 'message' || event.message.type !== 'text') {
        return;
      }
      this.botService.handleEvent(event);

      // const body = await this.parseRequestBody(req);
      // const results = await Promise.all(
      //   body.events.map(event => this.botService.handleEvent(event))
      // );
      // return res.json(results);
      return;
    } catch (error) {
      console.error(error);
      return res.status(500).end();
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
