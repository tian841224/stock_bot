import { Controller, Post, Req, Res, HttpCode } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { BrowserService } from '../browser/browser.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('tg-bot')
export class TgBotController {
    constructor(
        private readonly tgBotService: TgBotService,
        private readonly browserService: BrowserService,
        private readonly configService: ConfigService
    ) { }

    @ApiExcludeEndpoint()
    @Post()
    @HttpCode(200)
    async handleWebhook(@Req() req: Request, @Res() res: Response) {
        const secretToken = this.configService.get<string>('TELEGRAM_BOT_SECRET_TOKEN');

        // 驗證 secret token
        if (req.headers['x-telegram-bot-api-secret-token'] !== secretToken) {
            return res.sendStatus(403);
        }

        try {
            await this.tgBotService.handleUpdate(req.body);

            res.sendStatus(200);
        } catch (error) {
            console.error('Error processing update:', error);
            await this.browserService.disposeBrowser();
            res.sendStatus(500);
        }
    }
}
