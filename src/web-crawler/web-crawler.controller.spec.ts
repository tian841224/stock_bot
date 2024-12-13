import { Test, TestingModule } from '@nestjs/testing';
import { WebCrawlerController } from './web-crawler.controller';
import { WebCrawlerService } from './web-crawler.service';

describe('WebCrawlerController', () => {
  let controller: WebCrawlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebCrawlerController],
      providers: [WebCrawlerService],
    }).compile();

    controller = module.get<WebCrawlerController>(WebCrawlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
