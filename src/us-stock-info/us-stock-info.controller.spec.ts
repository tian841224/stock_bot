import { Test, TestingModule } from '@nestjs/testing';
import { UsStockInfoController } from './us-stock-info.controller';
import { UsStockInfoService } from './us-stock-info.service';

describe('UsStockInfoController', () => {
  let controller: UsStockInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsStockInfoController],
      providers: [UsStockInfoService],
    }).compile();

    controller = module.get<UsStockInfoController>(UsStockInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
