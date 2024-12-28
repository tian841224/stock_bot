import { Test, TestingModule } from '@nestjs/testing';
import { LineBotController } from './line-bot.controller';
import { LineBotService } from './line-bot.service';

describe('LineBotController', () => {
  let controller: LineBotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineBotController],
      providers: [LineBotService],
    }).compile();

    controller = module.get<LineBotController>(LineBotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
