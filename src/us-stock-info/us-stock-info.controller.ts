import { Controller, Get } from '@nestjs/common';
import { UsStockInfoService } from './us-stock-info.service';

@Controller('us-stock-info')
export class UsStockInfoController {
  constructor(private readonly usStockInfoService: UsStockInfoService) {}

    @Get()
    getTimeSeriesIntraday() {
      return this.usStockInfoService.getTimeSeriesIntraday();
    }
}
