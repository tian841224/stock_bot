import { PartialType } from '@nestjs/mapped-types';
import { CreateWebCrawlerDto } from './create-web-crawler.dto';

export class UpdateWebCrawlerDto extends PartialType(CreateWebCrawlerDto) {}
