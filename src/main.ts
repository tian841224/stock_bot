import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as line from '@line/bot-sdk';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const lineMiddleware = line.middleware({
  //   channelSecret: process.env.CHANNEL_SECRET
  // });

  // app.use('/callback', lineMiddleware);

  let port = process.env.PORT ?? 3000;
  console.log(`app listening at http://localhost:${port}`);
  await app.listen(port);

}
bootstrap();
