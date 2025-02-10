import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { UserModule } from './user/user.module';
import { SubscriptionStockModule } from './subscription-stock/subscription-stock.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { NotificationHistoryModule } from './notification-history/notification-history.module';

@Module({
  imports: [SubscriptionModule,SubscriptionStockModule,UserModule,NotificationHistoryModule],
  controllers: [RepositoryController],
  providers: [RepositoryService],
  exports: [RepositoryService]
})
export class RepositoryModule {}
