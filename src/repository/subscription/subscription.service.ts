import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from 'src/model/entity/subscription.entity';
import { SubscriptionItem } from 'src/model/enum/subscription-item.enum';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private repository: Repository<Subscription>,
  ) { }

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<boolean> {
    try {
      await this.repository.save(createSubscriptionDto);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async findAll(): Promise<Subscription[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<Subscription> {
    return await this.repository.findOneBy({ id });
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return await this.repository.findBy({ userId });
  }

  async getIdByUserIdAndItem(userId: string, item: SubscriptionItem): Promise<number> {
    return (await this.repository.findOneBy({ userId, item })).id;
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return await this.repository.update(id, updateSubscriptionDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }
}
