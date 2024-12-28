import { Module } from '@nestjs/common';
import { TwStockInfoService } from './tw-stock-info.service';
import { TwStockInfoController } from './tw-stock-info.controller';

@Module({
  controllers: [TwStockInfoController],
  providers: [TwStockInfoService],
})
export class TwStockInfoModule {}
