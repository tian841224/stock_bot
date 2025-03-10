import { TgBotService } from '../tg-bot/tg-bot.service';
import { RepositoryService } from '../repository/repository.service';
import { SubscriptionService } from '../repository/subscription/subscription.service';
import { Logger } from '@nestjs/common/services/logger.service';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Cron } from '@nestjs/schedule/dist/decorators/cron.decorator';
import { SubscriptionItem } from '@prisma/client';

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);
    constructor(
        private readonly repositoryService: RepositoryService,
        private readonly tgBotService: TgBotService,
        private readonly subscriptionService: SubscriptionService,
    ) { }

    @Cron(process.env.CRON_SCHEDULE || '0 0 15 * * 1-5')
    private async scheduleStockInfoPush() {
        try {
            this.logger.log('定時任務啟動');
            
            // 遍歷所有訂閱項目
            const items = Object.values(SubscriptionItem) as SubscriptionItem[];
            await Promise.all(items.map(item => this.handleSubscriptionItem(item)));
            
            this.logger.log('定時任務結束');
        } catch (error) {
            this.logger.error(`定時任務執行失敗: ${error.message}`);
        }
    }

    private async handleSubscriptionItem(item: SubscriptionItem): Promise<void> {
        try {
            const subscriptionList = await this.subscriptionService.findByItem(item);
            const userIds = subscriptionList.map(subscription => subscription.userId);
            
            if (userIds.length === 0) {
                return;
            }

            this.logger.log(`開始處理訂閱項目: ${item}`);
            await Promise.all(userIds.map(userId => this.processUserSubscription(userId, item)));
            this.logger.log(`完成處理訂閱項目: ${item}`);
        } catch (error) {
            this.logger.error(`處理訂閱項目 ${item} 失敗: ${error.message}`);
        }
    }

    private async processUserSubscription(userId: string, item: SubscriptionItem): Promise<void> {
        const numericUserId = Number(userId);
        
        try {
            switch (item) {
                case SubscriptionItem.DAILY_MARKET_INFO:
                    await this.tgBotService.getDailyMarketInfoAsync(numericUserId, 1);
                    break;

                case SubscriptionItem.STOCK_INFO:
                case SubscriptionItem.STOCK_NEWS:
                    const subscriptionStockList = await this.repositoryService.getUserSubscriptionStockListAsync(userId);
                    await Promise.all(
                        subscriptionStockList.map(async ({ stock }) => {
                            if (item === SubscriptionItem.STOCK_INFO) {
                                await this.tgBotService.getAfterTradingVolumeAsync(numericUserId, stock);
                            } else {
                                await this.tgBotService.getYahooNewsAsync(numericUserId, stock);
                            }
                        })
                    );
                    break;

                case SubscriptionItem.TOP_VOLUME_ITEMS:
                    await this.tgBotService.getTopVolumeItemsAsync(numericUserId);
                    break;
            }
        } catch (error) {
            this.logger.error(`處理用戶 ${userId} 的 ${item} 訂閱失敗: ${error.message}`);
        }
    }
}
