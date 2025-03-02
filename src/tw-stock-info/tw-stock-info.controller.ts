import { Controller, Get, Query } from '@nestjs/common';
import { TwStockInfoService } from './tw-stock-info.service';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('tw-stock-info')
export class TwStockInfoController {
  constructor(private readonly twStockInfoService: TwStockInfoService) { }

  @ApiOperation({ summary: '取得今日大盤行情' })
  @ApiParam({ name: 'count', required: false, description: '取得幾天內的資料' })
  @Get('getDailyMarketInfo')
  async getDailyMarketInfo(@Query('count') param?: number) {
    return await this.twStockInfoService.getDailyMarketInfoAsync(param);
  }

  @ApiOperation({ summary: '取得盤後個股資訊' })
  @ApiParam({ name: 'symbol', required: true, description: '輸入股票代號' })
  @Get('getAfterTradingVolume')
  async getAfterTradingVolume(@Query('symbol') param: string) {
    return await this.twStockInfoService.getAfterTradingVolumeAsync(param);
  }

  @ApiOperation({ summary: '取得成交量前20股票' })
  @Get('getTopVolumeItems')
  async getTopVolumeItems() {
    return await this.twStockInfoService.getTopVolumeItemsAsync();
  }

  @ApiOperation({ summary: '取得個股新聞' })
  @ApiParam({ name: 'symbol', required: true, description: '輸入股票代號' })
  @Get('getStockNews')
  async getStockNews(@Query('symbol') param: string) {
    return await this.twStockInfoService.getStockNewsAsync(param);
  }
}
