import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionStock } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscriptionStockDto } from './dto/create-subscription-stock.dto';
import { UpdateSubscriptionStockDto } from './dto/update-subscription-stock.dto';

@Injectable()
export class SubscriptionStockService {
  private readonly logger = new Logger(SubscriptionStockService.name);

  constructor(
    private prisma: PrismaService
  ) { }

  async create(createSubscriptionStockDto: CreateSubscriptionStockDto): Promise<boolean> {
    try {
      const exist = await this.findBySubscriptionIdAndStock(createSubscriptionStockDto.subscriptionId, createSubscriptionStockDto.stock,);
      if (exist) {
        return false;
      }
      await this.prisma.subscriptionStock.create({ data: createSubscriptionStockDto });
      return true;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async findAll(): Promise<SubscriptionStock[]> {
    return await this.prisma.subscriptionStock.findMany({ where: { status: 1 } });
  }

  async findOne(id: number): Promise<SubscriptionStock> {
    return await this.prisma.subscriptionStock.findUnique({ where: { id, status: 1 } });
  }

  async findBySubscriptionId(subscriptionId: number): Promise<SubscriptionStock[]> {
    return await this.prisma.subscriptionStock.findMany({ where: { subscriptionId: subscriptionId, status: 1 } });
  }

  async findBySubscriptionIdAndStock(subscriptionId: number, stock: string): Promise<SubscriptionStock> {
    return await this.prisma.subscriptionStock.findFirst({ where: { subscriptionId, stock, status: 1 } });
  }

  async findByUserIdAndStock(userId: string, stock: string): Promise<SubscriptionStock | null> {
    return await this.prisma.subscriptionStock.findFirst({ where: { stock: stock, subscription: { userId: userId, status: 1 }, status: 1 } });
  }

  async update(id: number, updateSubscriptionStockDto: UpdateSubscriptionStockDto) {
    try {
      return await this.prisma.subscriptionStock.update({ where: { id }, data: updateSubscriptionStockDto });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.prisma.subscriptionStock.delete({ where: { id } });
      return true;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
