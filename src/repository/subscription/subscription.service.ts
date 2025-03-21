import { Injectable, Logger } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Subscription, SubscriptionItem } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    private prisma: PrismaService
  ) { }

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<boolean> {
    try {
      await this.prisma.subscription.create({
        data: createSubscriptionDto,
      });
      return true;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async findAll(): Promise<Subscription[]> {
    return await this.prisma.subscription.findMany({ where: { status: 1 } });
  }

  async findOne(id: number): Promise<Subscription> {
    return await this.prisma.subscription.findUnique({ where: { id, status: 1 } });
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return await this.prisma.subscription.findMany({ where: { userId, status: 1 } });
  }

  async findByItem(item: SubscriptionItem): Promise<Subscription[]> {
    return await this.prisma.subscription.findMany({ where: { item, status: 1 } });
  }

  async findByUserIdAndItem(userId: string, item: SubscriptionItem): Promise<Subscription> {
    return await this.prisma.subscription.findFirst({ where: { userId, item, status: 1 } });
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    try {
      return await this.prisma.subscription.update({ where: { id }, data: updateSubscriptionDto });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.prisma.subscription.delete({ where: { id } });
      return true;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
