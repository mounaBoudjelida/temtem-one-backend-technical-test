import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformResponseInterceptor } from './interceptors/transformResponse.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { logger } from './utils/custom-logger.utils';
import { LoggerService } from './modules/shared/logger/logger.service';
import { GlobalExceptionFilter } from './exceptions-filters/global-exception-filter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // set up global exception filter
  (function () {
    const loggerService = app.get<LoggerService>(LoggerService);
    app.useGlobalFilters(new GlobalExceptionFilter(loggerService));
  })();
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  const configService = app.get(ConfigService<{ PORT: number }, true>);

  const config = new DocumentBuilder()
    .setTitle('Products Store')
    .setDescription('Products Store API description')
    .setVersion('1.0')
    .addTag('Products')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('products-stote-api', app, document);
  await app.listen(configService.get('PORT', 4000));
}
bootstrap();
