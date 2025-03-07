import { Injectable, Logger } from '@nestjs/common';
import { CreateSubscriptionStockDto } from './dto/create-subscription-stock.dto';
import { UpdateSubscriptionStockDto } from './dto/update-subscription-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionStock } from 'src/model/entity/subscription-stock.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class SubscriptionStockService {
  private readonly logger = new Logger(SubscriptionStockService.name);

  constructor(
    @InjectRepository(SubscriptionStock)
    private repository: Repository<SubscriptionStock>,
  ) { }

  async create(createSubscriptionStockDto: CreateSubscriptionStockDto): Promise<boolean> {
    try {
      await this.repository.save(createSubscriptionStockDto);
      return true;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async findAll(): Promise<SubscriptionStock[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<SubscriptionStock> {
    return await this.repository.findOneBy({ id });
  }

  async findBySubscriptionId(subscriptionId: number): Promise<SubscriptionStock[]> {
    return await this.repository.findBy({ subscription: { id: subscriptionId } });
  }

  async findBySubscriptionIdAndStock(subscriptionId: number, stock: string): Promise<SubscriptionStock> {
    return await this.repository.findOneBy({ subscription: { id: subscriptionId }, stock: stock });
  }

  async update(id: number, updateSubscriptionStockDto: UpdateSubscriptionStockDto): Promise<UpdateResult> {
    try {
      return await this.repository.update(id, updateSubscriptionStockDto);;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      return await this.repository.delete(id);;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
