import { Module } from '@nestjs/common';
import { SubscriptionStockService } from './subscription-stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionStock } from 'src/model/entity/subscription-stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionStock])],
  providers: [SubscriptionStockService],
  exports: [SubscriptionStockService]
})
export class SubscriptionStockModule {}
