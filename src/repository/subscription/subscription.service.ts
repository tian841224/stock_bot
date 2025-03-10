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
    return await this.prisma.subscription.findMany();
  }

  async findOne(id: number): Promise<Subscription> {
    return await this.prisma.subscription.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return await this.prisma.subscription.findMany({ where: { userId } });
  }

  async findByItem(item: SubscriptionItem): Promise<Subscription[]> {
    return await this.prisma.subscription.findMany({ where: { item } });
  }

  async findByUserIdAndItem(userId: string, item: SubscriptionItem): Promise<Subscription> {
    return await this.prisma.subscription.findUnique({ where: { userId_item: { userId, item } } });
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
      await this.prisma.subscription.delete({where: { id }});
      return true;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
