import { Injectable } from '@nestjs/common';
import { CreateSubscriptionStockDto } from './dto/create-subscription-stock.dto';
import { UpdateSubscriptionStockDto } from './dto/update-subscription-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionStock } from 'src/model/entity/subscription-stock.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionStockService {
  constructor(
    @InjectRepository(SubscriptionStock)
    private repository: Repository<SubscriptionStock>,
  ) { }

  async create(createSubscriptionStockDto: CreateSubscriptionStockDto) {
    try {
      await this.repository.save(createSubscriptionStockDto);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async findAll(): Promise<SubscriptionStock[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<SubscriptionStock> {
    return await this.repository.findOneBy({id});
  }

  async findBySubscriptionId(subscriptionId: number): Promise<SubscriptionStock[]> {
    return await this.repository.findBy({ subscription: { id: subscriptionId } });
  }
  async update(id: number, updateSubscriptionStockDto: UpdateSubscriptionStockDto) {
    return await this.repository.update(id, updateSubscriptionStockDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }
}
