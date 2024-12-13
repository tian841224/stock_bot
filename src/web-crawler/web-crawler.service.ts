import { Injectable } from '@nestjs/common';
import { CreateWebCrawlerDto } from './dto/create-web-crawler.dto';
import { UpdateWebCrawlerDto } from './dto/update-web-crawler.dto';

@Injectable()
export class WebCrawlerService {
  create(createWebCrawlerDto: CreateWebCrawlerDto) {
    return 'This action adds a new webCrawler';
  }

  findAll() {
    return `This action returns all webCrawler`;
  }

  findOne(id: number) {
    return `This action returns a #${id} webCrawler`;
  }

  update(id: number, updateWebCrawlerDto: UpdateWebCrawlerDto) {
    return `This action updates a #${id} webCrawler`;
  }

  remove(id: number) {
    return `This action removes a #${id} webCrawler`;
  }
}
