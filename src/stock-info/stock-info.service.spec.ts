import { Test, TestingModule } from '@nestjs/testing';
import { StockInfoService } from './stock-info.service';

describe('StockInfoService', () => {
  let service: StockInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockInfoService],
    }).compile();

    service = module.get<StockInfoService>(StockInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
