import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationHistoryDto } from './dto/create-notification-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationHistory } from 'src/model/entity/notification-history.entity';

@Injectable()
export class NotificationHistoryService {
  private readonly logger = new Logger(NotificationHistoryService.name);

    constructor(
      @InjectRepository(NotificationHistory)
      private repository: Repository<NotificationHistory>,
    ) { }
    
    async create(createNotificationHistoryDto: CreateNotificationHistoryDto): Promise<boolean> {
      try {
        await this.repository.save(createNotificationHistoryDto);
        return true;
      } catch (e) {
        this.logger.error(e);
        throw e;
      }
    }

    async findAll(): Promise<NotificationHistory[]> {
      return await this.repository.find();
  }

  async getLastNotification(date: Date): Promise<NotificationHistory> {
    return await this.repository.findOneBy({ createdAt: date });
  }
}
