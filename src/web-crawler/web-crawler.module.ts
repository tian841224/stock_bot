import { Module } from '@nestjs/common';
import { WebCrawlerService } from './web-crawler.service';
import { WebCrawlerController } from './web-crawler.controller';

@Module({
  controllers: [WebCrawlerController],
  providers: [WebCrawlerService],
})
export class WebCrawlerModule {}
