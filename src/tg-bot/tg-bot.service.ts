import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { TwStockInfoService } from '../tw-stock-info/tw-stock-info.service';
import { Context, Telegraf, Telegram } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { RepositoryService } from 'src/repository/repository.service';

@Injectable()
export class TgBotService {
    private tgBot: Telegram
    private readonly logger = new Logger(TgBotService.name);
    constructor(
        @InjectBot()
        private bot: Telegraf<Context>,
        private readonly twStockInfoService: TwStockInfoService,
        private readonly repositoryService: RepositoryService
    ) {
        this.tgBot = this.bot.telegram;
    }

    private async start(message: Message.TextMessage) {
        const text = `台股機器人指令指南🤖

📊 基本K線圖
格式：/k [股票代碼] [時間範圍]

時間範圍選項（預設：d）：
- h - 時K線
- d - 日K線
- w - 週K線
- m - 月K線
- 5m - 5分K線
- 15m - 15分K線
- 30m - 30分K線
- 60m - 60分K線

股票資訊指令
- /d [股票代碼] - 查詢股票詳細資訊
- /p [股票代碼] - 查詢股票績效
- /n [股票代碼] - 查詢股票新聞
- /yn [股票代碼] - 查詢Yahoo股票新聞（預設：台股新聞）
- /i [股票代碼] - 查詢當日收盤資訊

市場總覽指令
- /m - 查詢大盤資訊
- /t - 查詢當日交易量前20名

訂閱股票資訊
- /add [股票代碼] - 訂閱 股票
- /del [股票代碼] - 取消訂閱 股票
- /sub t - 訂閱 當日交易量前20名
- /sub d - 訂閱 當日市場成交行情
- /sub n - 訂閱 觀察清單新聞
- /sub i - 訂閱 當日個股資訊
(取消訂閱 unsub + 代號)`;

        await this.tgBot.sendMessage(message.chat.id, text);
    }

    private async getKlineAsync(message: Message.TextMessage, symbol: string, timeRange?: string) {
        try {
            if (symbol == null) {
                this.logger.log(`getKlineAsync:未輸入股票代號`);
                await this.tgBot.sendMessage(message.chat.id, '請輸入股票代號');
                return;
            }

            let result = await this.twStockInfoService.getKlineAsync(symbol, timeRange);
            const imageBuffer = Buffer.from(result.image);

            await this.tgBot.sendPhoto(
                message.chat.id,
                { source: imageBuffer },
                {
                    caption: `${result.stockName}(${symbol}) K線圖　💹`,
                    parse_mode: 'HTML'
                }
            );
        } catch (error) {
            this.logger.error(error, 'getKlineAsync');
            throw error;
        }
    }

    private async getPerformanceAsync(message: Message.TextMessage, symbol: string) {

        try {
            if (symbol == null) {
                this.logger.log(`getPerformanceAsync:未輸入股票代號`);
                await this.tgBot.sendMessage(message.chat.id, '請輸入股票代號');
                return;
            }

            let result = await this.twStockInfoService.getPerformanceAsync(symbol);
            const imageBuffer = Buffer.from(result.image);

            await this.tgBot.sendPhoto(
                message.chat.id,
                { source: imageBuffer },
                {
                    caption: `${result.stockName}(${symbol}) 績效表現　✨`,
                    parse_mode: 'HTML'
                }
            );
        } catch (error) {
            this.logger.error(error, 'getPerformanceAsync');
            throw error;
        }

    }

    private async getDetailPriceAsync(message: Message.TextMessage, symbol: string) {
        try {
            if (symbol == null) {
                this.logger.log(`getDetailPriceAsync:未輸入股票代號`);
                await this.tgBot.sendMessage(message.chat.id, '請輸入股票代號');
                return;
            }

            let result = await this.twStockInfoService.getDetailPriceAsync(symbol);
            const imageBuffer = Buffer.from(result.image);

            await this.tgBot.sendPhoto(
                message.chat.id,
                { source: imageBuffer },
                {
                    caption: `${result.stockName}(${symbol})-股票詳細資訊　📝`,
                    parse_mode: 'HTML'
                }
            );
        } catch (error) {
            this.logger.error(error, 'getDetailPriceAsync');
            throw error;
        }
    }

    private async getNewsAsync(message: Message.TextMessage, symbol: string) {
        try {
            if (symbol == null) {
                this.logger.log(`getNewsAsync:未輸入股票代號`);
                await this.tgBot.sendMessage(message.chat.id, '請輸入股票代號');
                return;
            }

            let result = await this.twStockInfoService.getNewsAsync(symbol);
            // 建立新聞按鈕
            const inlineKeyboard = result.newsList.map(news => [{
                text: news.text,
                url: news.url
            }]);

            // 發送新聞訊息
            await this.tgBot.sendMessage(
                message.chat.id,
                `⚡️${result.stockName}(${symbol})-即時新聞`,
                {
                    reply_markup: {
                        inline_keyboard: inlineKeyboard
                    }
                }
            );
        } catch (error) {
            this.logger.error(error, 'getNewsAsync');
            throw error;
        }
    }

    private async getYahooNewsAsync(message: Message.TextMessage, symbol: string) {
        try {
            if (symbol == null) {
                this.logger.log(`getYahooNewsAsync:未輸入股票代號`);
                await this.tgBot.sendMessage(message.chat.id, '請輸入股票代號');
                return;
            }

            let result = await this.twStockInfoService.getStockNewsAsync(symbol);
            // 建立新聞按鈕
            const inlineKeyboard = result.map(news => [{
                text: news.title,
                url: news.link
            }]);

            // 發送新聞訊息
            await this.tgBot.sendMessage(
                message.chat.id,
                `⚡️${symbol}-即時新聞`,
                {
                    reply_markup: {
                        inline_keyboard: inlineKeyboard
                    }
                }
            );
        } catch (error) {
            this.logger.error(error, 'getYahooNewsAsync');
            throw error;
        }
    }

    private async getDailyMarketInfoAsync(message: Message.TextMessage, num: string) {

        try {
            let count = 1;
            if (num != null) {

                count = parseInt(num);
                if (isNaN(count)) {
                    await this.tgBot.sendMessage(message.chat.id, '請輸入數字');
                    return;
                }
            }

            let result = await this.twStockInfoService.getDailyMarketInfoAsync(count);
            if(result == null) {
                this.logger.log(`getDailyMarketInfoAsync:查無資料`);
                await this.tgBot.sendMessage(message.chat.id, '查無資料,請確認後再試');
                return;
            }
            let messageText = '<b>台灣股市大盤資訊</b>\n\n';
            for (const row of result) {
                messageText += `<b>${row.date}</b>\n`;
                messageText += `<code>`;
                messageText += `成交股數：${row.volume}\n`;
                messageText += `成交金額：${row.amount}\n`;
                messageText += `成交筆數：${row.transaction}\n`;
                messageText += `發行量加權股價指數：${row.index}\n`;
                messageText += `漲跌點數：${row.change}\n`;
                messageText += `</code>\n`;
            }
            await this.tgBot.sendMessage(message.chat.id, messageText, { parse_mode: 'HTML' });
        } catch (error) {
            this.logger.error(error, 'getDailyMarketInfoAsync');
            throw error;
        }
    }

    private async getTopVolumeItemsAsync(message: Message.TextMessage) {

        try {
            let result = await this.twStockInfoService.getTopVolumeItemsAsync();
            if(result == null) {
                this.logger.log(`getTopVolumeItemsAsync:查無資料`);
                await this.tgBot.sendMessage(message.chat.id, '查無資料,請確認後再試');
                return;
            }
            let messageText = '🔝<b>今日交易量前二十</b>\n\n';

            for (const item of result) {
                const emoji = item.upDownSign === '+' ? '📈' : item.upDownSign === '-' ? '📉' : '';
                messageText += `${emoji}<b>${item.stockName} (${item.stockId})</b>\n<code>`;
                messageText += `成交股數：${item.volume}\n`;
                messageText += `成交筆數：${item.transaction}\n`;
                messageText += `開盤價：${item.openPrice}\n`;
                messageText += `收盤價：${item.closePrice}\n`;
                messageText += `漲跌幅：${item.upDownSign}${item.changeAmount} (${item.upDownSign}${item.percentageChange})\n`;
                messageText += `最高價：${item.highPrice}\n`;
                messageText += `最低價：${item.lowPrice}\n`;
                messageText += `</code>\n`;
            }

            await this.tgBot.sendMessage(message.chat.id, messageText, { parse_mode: 'HTML' });
        } catch (error) {
            this.logger.error(error, 'getTopVolumeItemsAsync');
            throw error;
        }
    }

    private async getAfterTradingVolumeAsync(message: Message.TextMessage, symbol: string) {

        try {
            if (symbol == null) {
                this.logger.log(`getAfterTradingVolumeAsync:未輸入股票代號`);
                await this.tgBot.sendMessage(message.chat.id, '請輸入股票代號');
                return;
            }

            let result = await this.twStockInfoService.getAfterTradingVolumeAsync(symbol);
            if(result == null) {
                this.logger.log(`getAfterTradingVolumeAsync:查無資料`);
                await this.tgBot.sendMessage(message.chat.id, '查無資料,請確認後再試');
                return;
            }

            const emoji = result.upDownSign === '+' ? '📈' : result.upDownSign === '-' ? '📉' : '';

            let messageText = '';
            messageText += `<b>${result.stockName} (${result.stockId})</b>${emoji}<code>\n`;
            messageText += `成交股數：${result.volume}\n`;
            messageText += `成交筆數：${result.transaction}\n`;
            messageText += `成交金額：${result.amount}\n`;
            messageText += `開盤價：${result.openPrice}\n`;
            messageText += `收盤價：${result.closePrice}\n`;
            messageText += `漲跌幅：${result.upDownSign}${result.changeAmount} (${result.percentageChange})\n`;
            messageText += `最高價：${result.highPrice}\n`;
            messageText += `最低價：${result.lowPrice}\n`;
            messageText += `</code>`;

            await this.tgBot.sendMessage(message.chat.id, messageText, { parse_mode: 'HTML' });
        } catch (error) {
            this.logger.error(error, 'getAfterTradingVolumeAsync');
            throw error;
        }
    }

    // 新增使用者訂閱項目
    private async addUserSubscriptionAsync(message: Message.TextMessage, item: string) {
        try {
            const userId = message.chat.id.toString();
            const subscription: number = Number(item);

            await this.repositoryService.addUserSubscriptionItemAsync(userId, subscription);
            await this.tgBot.sendMessage(message.chat.id, '訂閱成功');
        } catch (error) {
            this.logger.error(error, 'addUserSubscription');
            await this.tgBot.sendMessage(message.chat.id, '訂閱失敗');
            throw error;
        }
    }

    // 更新使用者訂閱項目
    private async updateUserSubscriptionAsync(message: Message.TextMessage, item: string, status: number) {
        try {
            const userId = message.chat.id.toString();
            const subscription: number = Number(item);

            // 取得使用者訂閱項目
            const userSubItem = await this.repositoryService.getUserSubscriptionByItemAsync(userId, subscription);
            if (userSubItem === null) {
                await this.addUserSubscriptionAsync(message, item);
                return;
            }

            await this.repositoryService.updateUserSubscriptionItemAsync(userId, subscription, status);

            if (status === 0) {
                await this.tgBot.sendMessage(message.chat.id, '取消訂閱成功');
            } else {
                await this.tgBot.sendMessage(message.chat.id, '訂閱成功');
            }

        } catch (error) {
            this.logger.error(error, 'updateUserSubscription');
            await this.tgBot.sendMessage(message.chat.id, '訂閱失敗');
            throw error;
        }
    }

    private async addSubscriptionStockAsync(message: Message.TextMessage, str: string) {
        try {
            const userId = message.chat.id.toString();
            await this.repositoryService.addUserSubscriptionStockAsync(userId, str);
            await this.tgBot.sendMessage(message.chat.id, '訂閱成功');

        } catch (error) {
            this.logger.error(error);
            await this.tgBot.sendMessage(message.chat.id, '訂閱失敗');
            throw error;
        }
    }

    private async deleteSubscriptionStockAsync(message: Message.TextMessage, str: string) {
        try {
            const userId = message.chat.id.toString();
            await this.repositoryService.deleteUserSubscriptionStockAsync(userId, str);
            await this.tgBot.sendMessage(message.chat.id, '取消訂閱成功');

        } catch (error) {
            this.logger.error(error);
            await this.tgBot.sendMessage(message.chat.id, '取消訂閱失敗');
            throw error;
        }
    }

    async handleUpdate(ctx: Context) {
        if (ctx.message == null) return;

        const message = ctx.message as Message.TextMessage;
        this.handleCommand(message);
    }

    private async handleCommand(message: Message.TextMessage) {
        const messageText = message.text;
        const command1 = messageText.split(' ')[1];

        switch (messageText.split(' ')[0]) {
            case '/start':
                this.start(message);
                break;
            case '/k':
                await this.getKlineAsync(message, command1);
                break;
            case '/p':
                await this.getPerformanceAsync(message, command1);
                break;
            case '/d':
                await this.getDetailPriceAsync(message, command1);
                break;
            case '/n':
                await this.getNewsAsync(message, command1);
                break;
            case '/yn':
                await this.getYahooNewsAsync(message, command1);
                break;
            case '/m':
                await this.getDailyMarketInfoAsync(message, command1);
                break;
            case '/t':
                await this.getTopVolumeItemsAsync(message);
                break;
            case '/i':
                await this.getAfterTradingVolumeAsync(message, command1);
                break;
            case '/sub':
                await this.updateUserSubscriptionAsync(message, command1, 1);
                break;
            case '/unsub':
                await this.updateUserSubscriptionAsync(message, command1, 0);
                break;
            case '/add':
                await this.addSubscriptionStockAsync(message, command1);
                break;
            case '/del':
                await this.deleteSubscriptionStockAsync(message, command1);
            default:
                break;
        }
    }
}
