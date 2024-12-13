import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { BrowserModule } from './browser/browser.module';
import { WebCrawlerModule } from './web-crawler/web-crawler.module';

@Module({
  imports: [BotModule, BrowserModule, WebCrawlerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
