import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WebCrawlerService } from './web-crawler.service';
import { CreateWebCrawlerDto } from './dto/create-web-crawler.dto';
import { UpdateWebCrawlerDto } from './dto/update-web-crawler.dto';

@Controller('web-crawler')
export class WebCrawlerController {
  constructor(private readonly webCrawlerService: WebCrawlerService) {}

  @Post()
  create(@Body() createWebCrawlerDto: CreateWebCrawlerDto) {
    return this.webCrawlerService.create(createWebCrawlerDto);
  }

  @Get()
  findAll() {
    return this.webCrawlerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.webCrawlerService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWebCrawlerDto: UpdateWebCrawlerDto,
  ) {
    return this.webCrawlerService.update(+id, updateWebCrawlerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.webCrawlerService.remove(+id);
  }
}
