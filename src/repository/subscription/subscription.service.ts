import { Injectable, Logger } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Subscription } from 'src/model/entity/subscription.entity';
import { SubscriptionItem } from 'src/model/enum/subscription-item.enum';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    @InjectRepository(Subscription)
    private repository: Repository<Subscription>,
  ) { }

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<boolean> {
    try {
      await this.repository.save(createSubscriptionDto);
      return true;
    } catch (e) {
      this.logger.error(e);
      throw e;
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

  async findByItem(item: SubscriptionItem): Promise<Subscription[]> {
    return await this.repository.findBy({ item: item });
  }

  async findByUserIdAndItem(userId: string, item: SubscriptionItem): Promise<Subscription> {
    return await this.repository.findOneBy({ userId, item });
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    try {
      return await this.repository.update(id, updateSubscriptionDto);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      return await this.repository.delete(id);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
