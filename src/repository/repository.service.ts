import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionService } from './subscription/subscription.service';
import { SubscriptionStockService } from './subscription-stock/subscription-stock.service';
import { CreateSubscriptionDto } from './subscription/dto/create-subscription.dto';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UpdateSubscriptionDto } from './subscription/dto/update-subscription.dto';
import { CreateSubscriptionStockDto } from './subscription-stock/dto/create-subscription-stock.dto';
import { Subscription, SubscriptionItem, SubscriptionStock, User, UserType } from '@prisma/client';

@Injectable()
export class RepositoryService {
  private readonly logger = new Logger(RepositoryService.name);
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly subscriptionStockService: SubscriptionStockService,
    private readonly userService: UserService,
  ) { }

  async getUserSubscriptionListAsync(userId: string): Promise<Subscription[]> {
    return await this.subscriptionService.findByUserId(userId);
  }

  async getUserSubscriptionByItemAsync(userId: string, item: SubscriptionItem): Promise<Subscription> {
    return await this.subscriptionService.findByUserIdAndItem(userId, item);
  }

  async getUserSubscriptionStockListAsync(userId: string,): Promise<SubscriptionStock[]> {
    const subscription = await this.subscriptionService.findByUserIdAndItem(userId, SubscriptionItem.STOCK_INFO);
    if (!subscription) {
      return [];
    }
    return await this.subscriptionStockService.findBySubscriptionId(
      subscription.id,
    );
  }

  async findUserSubscriptionStockAsync(userId: string, stock: string,): Promise<SubscriptionStock> {
    const subscription = await this.subscriptionService.findByUserIdAndItem(userId, SubscriptionItem.STOCK_INFO);
    const subscriptionStock =
      await this.subscriptionStockService.findBySubscriptionIdAndStock(subscription.id, stock);
    if (!subscriptionStock) {
      return;
    }
    return subscriptionStock;
  }

  // 新增訂閱項目
  async addUserSubscriptionItemAsync(userId: string, item: SubscriptionItem): Promise<boolean> {
    try {
      // 取得使用者訂閱列表
      var userSubscription = await this.getUserSubscriptionByItemAsync(userId, item);
      if (userSubscription != null) {
        // 若已存在更新訂閱狀態為啟用
        await this.updateUserSubscriptionItemAsync(userId, item, 1);
        return true;
      }
      // 新增訂閱
      const createSubscriptionDto = new CreateSubscriptionDto();
      createSubscriptionDto.userId = userId;
      createSubscriptionDto.item = item;
      await this.subscriptionService.create(createSubscriptionDto);
      this.logger.log(`addUserSubscriptionItemAsync:新增訂閱項目成功, userId: ${userId}`,);
      return true;
    } catch (e) {
      this.logger.error(`addUserSubscriptionItem`, e);
      throw e;
    }
  }

  // 更新訂閱項目狀態
  async updateUserSubscriptionItemAsync(userId: string, item: SubscriptionItem, status: number): Promise<boolean> {
    try {
      // 取得使用者訂閱列表
      var userSubscription = await this.getUserSubscriptionByItemAsync(userId, item);
      if (userSubscription == null) {
        this.addUserSubscriptionItemAsync(userId, item);
      }
      // 更新訂閱
      const updateSubscriptionDto = new UpdateSubscriptionDto();
      updateSubscriptionDto.status = status;
      await this.subscriptionService.update(userSubscription.id, updateSubscriptionDto);
      this.logger.log(
        `updateUserSubscriptionItemAsync:更新訂閱項目成功, userId: ${userId}`,
      );
      return true;
    } catch (e) {
      this.logger.error(`updateUserSubscriptionItem`, e);
      throw e;
    }
  }

  // 新增使用者訂閱股票
  async addUserSubscriptionStockAsync(userId: string, stock: string): Promise<boolean> {
    try {
      // 取得使用者訂閱列表
      var userSubscription = await this.getUserSubscriptionByItemAsync(userId, SubscriptionItem.STOCK_INFO);
      if (userSubscription == null) {
        await this.addUserSubscriptionItemAsync(userId, SubscriptionItem.STOCK_INFO);
        userSubscription = await this.getUserSubscriptionByItemAsync(userId, SubscriptionItem.STOCK_INFO);
      }

      // 判斷是否已訂閱
      var userSubscriptionStock = await this.findUserSubscriptionStockAsync(userId, stock);
      if (userSubscriptionStock != null) {
        // 若已存在更新訂閱狀態為啟用
        await this.updateUserSubscriptionItemAsync(userId, SubscriptionItem.STOCK_INFO, 1);
        return true;
      }

      // 新增訂閱
      const createSubscriptionStockDto = new CreateSubscriptionStockDto();
      createSubscriptionStockDto.subscriptionId = userSubscription.id;
      createSubscriptionStockDto.stock = stock;
      const result = await this.subscriptionStockService.create(
        createSubscriptionStockDto,
      );
      if (!result) {
        return false;
      }
      this.logger.log(
        `addUserSubscriptionStockAsync:新增使用者訂閱股票, userId: ${userId}`,
      );
      return true;
    } catch (e) {
      this.logger.error(`addUserSubscriptionItem`, e);
      throw e;
    }
  }

  // 刪除使用者股票訂閱
  async deleteUserSubscriptionStockAsync(userId: string, stock: string,): Promise<boolean> {
    try {
      // 取得使用者訂閱列表
      var userSubscription = await this.getUserSubscriptionByItemAsync(userId, SubscriptionItem.STOCK_INFO);
      if (userSubscription == null) {
        return;
      }
      // 取得使用者訂閱股票
      var userSubscriptionStock = await this.findUserSubscriptionStockAsync(userId, stock);
      if(userSubscriptionStock == null){
        return;
      }
      await this.subscriptionStockService.remove(userSubscriptionStock.id);
      this.logger.log(`deleteUserSubscriptionStockAsync:更新使用者股票訂閱, userId: ${userId}`);
      return true;
    } catch (e) {
      this.logger.error(`updateUserSubscriptionItem`, e);
      throw e;
    }
  }

  // 取得使用者(不存在則新增)
  async getUserAsync(userId: string, type: UserType): Promise<User> {
    try {
      let user = await this.userService.findByUserId(userId);
      if (user == null) {
        await this.addUserAsync(userId, type);
        user = await this.userService.findByUserId(userId);
      }
      return user;
    } catch (e) {
      this.logger.error(`getUser`, e);
      throw e;
    }
  }

  private async addUserAsync(userId: string, type: UserType): Promise<boolean> {
    try {
      // 判斷使用者是否存在
      let user = await this.userService.findByUserId(userId);
      if (user == null) {
        const createUserDto: CreateUserDto = {
          userid: userId,
          type: type,
          status: 1,
        };
        return await this.userService.create(createUserDto);
      }
    } catch (e) {
      this.logger.error(`AddUserAsync`, e);
      throw e
    }
  }
}
