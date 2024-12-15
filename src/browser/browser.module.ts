import { Module } from '@nestjs/common';
import { BrowserService } from './browser.service';

@Module({
  providers: [BrowserService],
})
export class BrowserModule {}
