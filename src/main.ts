import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // rawBody: true,
    // bodyParser: true,
  });
  let port = process.env.PORT ?? 3000;

  const environment = process.env.NODE_ENV;
  Logger.log(`目前環境：${environment}`);
  
  // 設定全域異常過濾器
  const configService = app.get(ConfigService);
  app.useGlobalFilters(new GlobalExceptionFilter(configService));
  
  // app.use(multer().any());
  app.use(compression());  // 啟用壓縮

  // 設定全域前綴 - 由 nginx 處理前綴
  // app.setGlobalPrefix('stockbot-nestjs');

  // 配置 Swagger
  const config = new DocumentBuilder()
    .setTitle('Stock API Documentation')
    .setDescription('使用Node.js Nest 框架撰寫的股票機器人 API 文件')
    .setVersion('1.0')
    //  .addBearerAuth() // 如果有 JWT 驗證
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);

  Logger.log(`app listening at http://localhost:${port}`);
  Logger.log(`swagger doc at http://localhost:${port}/swagger`);
}
bootstrap();