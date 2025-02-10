import { Injectable } from '@nestjs/common';
import { SubscriptionService } from './subscription/subscription.service';
import { SubscriptionStockService } from './subscription-stock/subscription-stock.service';
import { UserService } from './user/user.service';
import { Subscription } from 'src/model/entity/subscription.entity';
import { SubscriptionStock } from 'src/model/entity/subscription-stock.entity';
import { NotificationHistoryService } from './notification-history/notification-history.service';
import { SubscriptionItem } from 'src/model/enum/subscription-item.enum';

@Injectable()
export class RepositoryService {

    constructor(
        private readonly subscriptionService: SubscriptionService,
        private readonly subscriptionStockService :SubscriptionStockService,
    ) {
    }
    
    async getUserSubscriptionList(userId: string): Promise<Subscription[]> {
        return await this.subscriptionService.findByUserId(userId);
    }

    async getUserSubscriptionStockList(userId: string): Promise<SubscriptionStock[]> {
        const subscriptionId =  await this.subscriptionService.getIdByUserIdAndItem(userId, SubscriptionItem.StockInfo);

        return await this.subscriptionStockService.findBySubscriptionId(subscriptionId);
    }

} 
