import { Global, Module } from '@nestjs/common';
import { TwStockInfoService } from './tw-stock-info.service';
import { TwStockInfoController } from './tw-stock-info.controller';
import { BrowserModule } from 'src/browser/browser.module';

@Global()
@Module({
  imports: [BrowserModule],
  controllers: [TwStockInfoController],
  providers: [TwStockInfoService],
  exports: [TwStockInfoService],
})
export class TwStockInfoModule { }
