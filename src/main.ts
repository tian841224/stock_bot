import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // rawBody: true,
    // bodyParser: true,
  });
  let port = process.env.PORT ?? 3000;
  // app.use(multer().any());
  app.use(compression());  // 啟用壓縮

  await app.listen(port);

  console.log(`app listening at http://localhost:${port}`);
}
bootstrap();