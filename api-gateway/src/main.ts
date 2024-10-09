import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_GATEWAY_PORT');

  await app.startAllMicroservices();
  await app.listen(port); // API Gateway sẽ chạy trên cổng được cấu hình trong .env
}

bootstrap();
