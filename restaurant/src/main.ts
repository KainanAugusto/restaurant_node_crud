import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('Authorization Header:', req.headers.authorization);
    next();
  });

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
