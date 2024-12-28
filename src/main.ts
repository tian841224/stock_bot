import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
  });
  let port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`app listening at http://localhost:${port}`);
}
bootstrap();