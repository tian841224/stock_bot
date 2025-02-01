import { Controller, Get, Query } from '@nestjs/common';
import { TwStockInfoService } from './tw-stock-info.service';

@Controller('tw-stock-info')
export class TwStockInfoController {
  constructor(private readonly twStockInfoService: TwStockInfoService) {}

  @Get('getDailyMarketInfo')
  async getDailyMarketInfo(@Query('count') param?: number) {
    return await this.twStockInfoService.getDailyMarketInfoAsync(param);
  }

  @Get('getAfterTradingVolume')
  async getAfterTradingVolume(@Query('symbol') param?: string) {
    return await this.twStockInfoService.getAfterTradingVolumeAsync(param);
  }

  @Get('getTopVolumeItems')
  async getTopVolumeItems() {
    return await this.twStockInfoService.getTopVolumeItemsAsync();
  }

  @Get('getStockNews')
  async getStockNews(@Query('symbol') param?: string) {
    return await this.twStockInfoService.getStockNewsAsync(param);
  }
}
