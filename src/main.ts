import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  await Logger.log(
    `*** Application running in on port 3000 *** http://localhost:3000/`,
  );
}
bootstrap();
