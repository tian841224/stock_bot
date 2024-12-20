import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { BrowserModule } from './browser/browser.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全域使用
    }),
    BotModule,
    BrowserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
