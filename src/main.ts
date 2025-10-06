import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { Request, Response, NextFunction } from 'express';
import { appLogger } from './common/logger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: appLogger,
  });

  app.use((req: Request & { reqId?: string }, _res: Response, next: NextFunction) => {
    req.reqId = uuid();
    next();
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const auditInterceptor = app.get(AuditInterceptor);
  app.useGlobalInterceptors(new LoggingInterceptor(), auditInterceptor);
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('API REST de SMPC Libros')
    .setVersion('1.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
