import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const config = new DocumentBuilder()
    .setTitle('Nest App Api Document')
    .setDescription('For Api test')
    .setVersion('0.0.1')
    .addBearerAuth()
    .addServer('api/v1')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  app.setGlobalPrefix('api/v1', {
    exclude: ['health']
  })
  await app.listen(process.env.PORT ?? 3000);
  app.useWebSocketAdapter(new IoAdapter(app))
}
bootstrap();
