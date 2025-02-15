import { Module } from '@nestjs/common';
import { NotificationHistoryService } from './notification-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationHistory } from 'src/model/entity/notification-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationHistory])],
  providers: [NotificationHistoryService],
  exports: [NotificationHistoryService]
})
export class NotificationHistoryModule {}
