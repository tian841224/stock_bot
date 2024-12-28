import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrowserModule } from './browser/browser.module';
import { LineBotModule } from './line-bot/line-bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全域使用
    }),
    BrowserModule,
    LineBotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
