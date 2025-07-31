import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'auth/google', method: RequestMethod.GET },
      { path: 'auth/google/redirect', method: RequestMethod.GET },
      { path: 'auth/yandex', method: RequestMethod.GET },
      { path: 'auth/yandex/redirect', method: RequestMethod.GET },
      { path: 'auth/github', method: RequestMethod.GET },
      { path: 'auth/github/redirect', method: RequestMethod.GET },
    ],
  });
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  await app.listen(process.env.PORT ?? 4200);
}

bootstrap().catch((e) => console.log(e));
