import { Module } from '@nestjs/common';
import { NotificationHistoryService } from './notification-history.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NotificationHistoryService],
  exports: [NotificationHistoryService],
})
export class NotificationHistoryModule {}
