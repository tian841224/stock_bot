import { Module } from '@nestjs/common';
import { SubscriptionStockService } from './subscription-stock.service';
import { SubscriptionStockController } from './subscription-stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionStock } from 'src/model/entity/subscription-stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionStock])],
  controllers: [SubscriptionStockController],
  providers: [SubscriptionStockService],
  exports: [SubscriptionStockService]
})
export class SubscriptionStockModule {}
