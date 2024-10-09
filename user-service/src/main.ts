import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Lấy ConfigService từ AppModule
  const configService = app.get(ConfigService);

  // Sử dụng ConfigService để lấy các giá trị cấu hình
  const rabbitUser = configService.get<string>('RABBITMQ_USER');
  const rabbitPass = configService.get<string>('RABBITMQ_PASS');
  const rabbitHost = configService.get<string>('RABBITMQ_HOST');
  const rabbitQueue = configService.get<string>('RABBITMQ_QUEUE_USER');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${rabbitUser}:${rabbitPass}@${rabbitHost}`],
      queue: rabbitQueue,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000); // Port của user-service
}

bootstrap();
