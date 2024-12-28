import { Test, TestingModule } from '@nestjs/testing';
import { TwStockInfoService } from './tw-stock-info.service';

describe('TwStockInfoService', () => {
  let service: TwStockInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwStockInfoService],
    }).compile();

    service = module.get<TwStockInfoService>(TwStockInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
