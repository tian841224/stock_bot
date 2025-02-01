import { Test, TestingModule } from '@nestjs/testing';
import { UsStockInfoService } from './us-stock-info.service';

describe('UsStockInfoService', () => {
  let service: UsStockInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsStockInfoService],
    }).compile();

    service = module.get<UsStockInfoService>(UsStockInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
