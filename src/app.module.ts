import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { BrowserModule } from './browser/browser.module';

@Module({
  imports: [BotModule, BrowserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
