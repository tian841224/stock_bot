import { Test, TestingModule } from '@nestjs/testing';
import { WebCrawlerService } from './web-crawler.service';

describe('WebCrawlerService', () => {
  let service: WebCrawlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebCrawlerService],
    }).compile();

    service = module.get<WebCrawlerService>(WebCrawlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
