import { Test, TestingModule } from '@nestjs/testing';
import { NotificationHistoryService } from './notification-history.service';

describe('NotificationHistoryService', () => {
  let service: NotificationHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationHistoryService],
    }).compile();

    service = module.get<NotificationHistoryService>(NotificationHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
