import { CreateNotificationHistoryDto } from './dto/create-notification-history.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationHistory } from '@prisma/client';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Logger } from '@nestjs/common/services/logger.service';

@Injectable()
export class NotificationHistoryService {
  private readonly logger = new Logger(NotificationHistoryService.name);

  constructor(private prisma: PrismaService) {}

  async create(
    createNotificationHistoryDto: CreateNotificationHistoryDto,
  ): Promise<boolean> {
    try {
      await this.prisma.notificationHistory.create({
        data: createNotificationHistoryDto,
      });
      return true;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async findAll(): Promise<NotificationHistory[]> {
    return await this.prisma.notificationHistory.findMany();
  }

  async getLastNotification(date: Date): Promise<NotificationHistory> {
    return await this.prisma.notificationHistory.findFirst({
      where: { createdAt: date },
    });
  }
}
