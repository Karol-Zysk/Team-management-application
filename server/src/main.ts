import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: 'http://127.0.0.1:5173',
    credentials: true,
  });

  // const config = new DocumentBuilder()
  //   .setTitle('Dashboard SP')
  //   .setDescription('SP Dashboard API')
  //   .setVersion('1.0')
  //   .addTag('SoftwarePartner')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();
