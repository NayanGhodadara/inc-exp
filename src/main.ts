import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './api/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule) as any;

  app.setGlobalPrefix('api/v1');
  app.enableCors();

  //Swagger
  const config = new DocumentBuilder()
    .setTitle('Inc-Exp API')
    .setDescription('API documentation for the Inc-Exp application')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(process.env.BASE_URL ?? "", 'Inc-Exp server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/api-docs', app, document, {
    customfavIcon: '/app-icon.png',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,

      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => {
          return Object.values(err.constraints || {});
        }).flat();

        return new BadRequestException({
          statusCode: 400,
          message: formattedErrors[0],
          error: 'Bad Request',
        });
      },
    }),
    //new UpperCasePipe()
  );


  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
