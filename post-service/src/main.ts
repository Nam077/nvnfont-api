import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Lấy cổng từ file .env
  const port = configService.get<number>('POST_SERVICE_PORT');

  // Kết nối với RabbitMQ cho post-service
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${configService.get('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASS')}@${configService.get('RABBITMQ_HOST')}`,
      ],
      queue: configService.get('RABBITMQ_QUEUE_POST'),
      queueOptions: {
        durable: false,
      },
    },
  });

  // Bắt đầu tất cả các microservice đã cấu hình
  await app.startAllMicroservices();

  // Lắng nghe ở cổng của post-service
  await app.listen(port);
}

bootstrap();
