import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow your React frontend to talk to this backend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(4000); // Or whatever port your NestJS is using
  console.log(`NestJS backend running on http://localhost:4000`);
}
void bootstrap();
