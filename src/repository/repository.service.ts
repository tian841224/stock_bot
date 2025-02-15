import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionService } from './subscription/subscription.service';
import { SubscriptionStockService } from './subscription-stock/subscription-stock.service';
import { Subscription } from 'src/model/entity/subscription.entity';
import { SubscriptionStock } from 'src/model/entity/subscription-stock.entity';
import { SubscriptionItem } from 'src/model/enum/subscription-item.enum';
import { CreateSubscriptionDto } from './subscription/dto/create-subscription.dto';
import { User } from 'src/model/entity/user.entity';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UpdateSubscriptionDto } from './subscription/dto/update-subscription.dto';
import { CreateSubscriptionStockDto } from './subscription-stock/dto/create-subscription-stock.dto';

@Injectable()
export class RepositoryService {
    private readonly logger = new Logger(RepositoryService.name);
    constructor(
        private readonly subscriptionService: SubscriptionService,
        private readonly subscriptionStockService: SubscriptionStockService,
        private readonly userService: UserService,
    ) {
    }

    async getUserSubscriptionListAsync(userId: string): Promise<Subscription[]> {
        return await this.subscriptionService.findByUserId(userId);
    }

    async getUserSubscriptionByItemAsync(userId: string, item: SubscriptionItem): Promise<Subscription> {
        return await this.subscriptionService.findByUserIdAndItem(userId, item);
    }

    async getUserSubscriptionStockListAsync(userId: string): Promise<SubscriptionStock[]> {
        const subscription = await this.subscriptionService.getIdByUserIdAndItem(userId, SubscriptionItem.StockInfo);
        if (!subscription) {
            return [];
        }
        return await this.subscriptionStockService.findBySubscriptionId(subscription.id);
    }

    async findUserSubscriptionStockAsync(userId: string, stock: string): Promise<SubscriptionStock> {
        const subscription = await this.subscriptionService.getIdByUserIdAndItem(userId, SubscriptionItem.StockInfo);
        const subscriptionStock = await this.subscriptionStockService.findBySubscriptionIdAndStock(subscription.id, stock);
        if (!subscriptionStock) {
            return;
        }
        return subscriptionStock;
    }

    // 新增訂閱項目
    async addUserSubscriptionItemAsync(userId: string, item: SubscriptionItem): Promise<boolean> {
        try {
            // 取得使用者
            const user = await this.getUserAsync(userId);

            // 取得使用者訂閱列表
            var userSubscription = await this.getUserSubscriptionByItemAsync(userId, item);
            if (userSubscription != null) {
                return;
            }
            // 新增訂閱
            const createSubscriptionDto = new CreateSubscriptionDto();
            createSubscriptionDto.userId = user.userid;
            createSubscriptionDto.item = item;
            await this.subscriptionService.create(createSubscriptionDto);
            this.logger.log(`addUserSubscriptionItemAsync:新增訂閱項目成功, userId: ${user.userid}`);
            return true;
        } catch (e) {
            this.logger.error(`addUserSubscriptionItem`, e);
            throw e;
        }
    }

    // 更新訂閱項目狀態
    async updateUserSubscriptionItemAsync(userId: string, item: SubscriptionItem, status: number): Promise<boolean> {
        try {
            // 取得使用者
            const user = await this.getUserAsync(userId);

            // 取得使用者訂閱列表
            var userSubscription = await this.getUserSubscriptionByItemAsync(user.userid, item);
            if (userSubscription == null) {
                this.addUserSubscriptionItemAsync(user.userid, item);
            }
            // 更新訂閱
            const updateSubscriptionDto = new UpdateSubscriptionDto();
            updateSubscriptionDto.status = status;
            await this.subscriptionService.update(userSubscription.id, updateSubscriptionDto);
            this.logger.log(`updateUserSubscriptionItemAsync:更新訂閱項目成功, userId: ${user.userid}`);
            return true
        } catch (e) {
            this.logger.error(`updateUserSubscriptionItem`, e);
            throw e;
        }
    }

    // 新增使用者訂閱股票
    async addUserSubscriptionStockAsync(userId: string, stock: string): Promise<boolean> {
        try {
            // 取得使用者訂閱列表
            var userSubscription = await this.getUserSubscriptionByItemAsync(userId, SubscriptionItem.StockInfo);
            if (userSubscription == null) {
                await this.addUserSubscriptionItemAsync(userId, SubscriptionItem.StockInfo);
                userSubscription = await this.getUserSubscriptionByItemAsync(userId, SubscriptionItem.StockInfo);
            }
            // 新增訂閱
            const createSubscriptionStockDto = new CreateSubscriptionStockDto();
            createSubscriptionStockDto.subscriptionId = userSubscription.id;
            createSubscriptionStockDto.stock = stock;
            await this.subscriptionStockService.create(createSubscriptionStockDto);
            this.logger.log(`addUserSubscriptionStockAsync:新增使用者訂閱股票, userId: ${userId}`);
            return true;
        } catch (e) {
            this.logger.error(`addUserSubscriptionItem`, e);
            throw e;
        }
    }

    // 更新使用者股票訂閱
    async deleteUserSubscriptionStockAsync(userId: string, stock: string): Promise<boolean> {
        try {
            // 取得使用者訂閱列表
            var userSubscription = await this.getUserSubscriptionByItemAsync(userId, SubscriptionItem.StockInfo);
            if (userSubscription == null) {
                return;
            }
            // 取得使用者訂閱股票
            var userSubscriptionStock = await this.findUserSubscriptionStockAsync(userId, stock);
            await this.subscriptionStockService.remove(userSubscriptionStock.id);
            this.logger.log(`deleteUserSubscriptionStockAsync:更新使用者股票訂閱, userId: ${userId}`);
            return true
        } catch (e) {
            this.logger.error(`updateUserSubscriptionItem`, e);
            throw e;
        }
    }

    // 取得使用者(不存在則新增)
    private async getUserAsync(userId: string): Promise<User> {
        try {
            // 判斷使用者是否存在
            let user = await this.userService.findByUserId(userId);
            if (user == null) {
                this.logger.log(`getUser:使用者不存在`);

                const createUserDto: CreateUserDto = {
                    userid: userId,
                    type: 1,
                    status: 1
                };

                await this.userService.create(createUserDto);
                this.logger.log(`getUser:新增使用者`);
            }

            user = await this.userService.findByUserId(userId);
            this.logger.log(`getUser:取得使用者 ${user.userid}`);
            return user;
        }
        catch (e) {
            this.logger.error(`getUser`, e);
            throw e;
        }
    }
} 
