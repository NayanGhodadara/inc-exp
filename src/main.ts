import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule) as any;

  app.setGlobalPrefix('api/v1');

  //Swagger
  const config = new DocumentBuilder()
    .setTitle('Inc-Exp API')
    .setDescription('API documentation for the Inc-Exp application')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(process.env.BASE_URL || "", 'Inc-Exp server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/api-docs', app, document, {
    customfavIcon: '/app_icon.png',
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
