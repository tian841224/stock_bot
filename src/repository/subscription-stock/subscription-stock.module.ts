import { Module } from '@nestjs/common';
import { SubscriptionStockService } from './subscription-stock.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SubscriptionStockService],
  exports: [SubscriptionStockService],
})
export class SubscriptionStockModule {}
