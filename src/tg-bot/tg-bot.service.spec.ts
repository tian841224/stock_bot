import { Test, TestingModule } from '@nestjs/testing';
import { TgBotService } from './tg-bot.service';

describe('TgBotService', () => {
  let service: TgBotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TgBotService],
    }).compile();

    service = module.get<TgBotService>(TgBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
