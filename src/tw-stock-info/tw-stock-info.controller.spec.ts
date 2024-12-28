import { Test, TestingModule } from '@nestjs/testing';
import { TwStockInfoController } from './tw-stock-info.controller';
import { TwStockInfoService } from './tw-stock-info.service';

describe('TwStockInfoController', () => {
  let controller: TwStockInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwStockInfoController],
      providers: [TwStockInfoService],
    }).compile();

    controller = module.get<TwStockInfoController>(TwStockInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
