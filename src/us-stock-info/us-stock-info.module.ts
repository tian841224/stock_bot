import { Module } from '@nestjs/common';
import { UsStockInfoService } from './us-stock-info.service';
import { UsStockInfoController } from './us-stock-info.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UsStockInfoController],
  providers: [{
    provide: 'ALPHA_VANTAGE_API_KEY',
    useFactory: (configService: ConfigService) => {
      return configService.get<string>('Alpha_Vantage_API_Key');
    },
    inject: [ConfigService]
  }, UsStockInfoService],
})
export class UsStockInfoModule { }
