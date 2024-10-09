import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const rabbitMQUser = configService.get<string>('RABBITMQ_USER');
  const rabbitMQPass = configService.get<string>('RABBITMQ_PASS');
  const rabbitMQHost = configService.get<string>('RABBITMQ_HOST');
  const redisHost = configService.get<string>('REDIS_HOST');
  const redisPort = configService.get<number>('REDIS_PORT');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${rabbitMQUser}:${rabbitMQPass}@${rabbitMQHost}`],
      queue: 'api_gateway_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  // Kết nối Redis Pub/Sub
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: redisHost,
      port: redisPort,
    },
  });

  await app.listen(3000);
}
bootstrap();
