import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionStockService } from './subscription-stock.service';

describe('SubscriptionStockService', () => {
  let service: SubscriptionStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionStockService],
    }).compile();

    service = module.get<SubscriptionStockService>(SubscriptionStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
