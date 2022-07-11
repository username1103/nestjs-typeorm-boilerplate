import { ClassSerializerInterceptor, INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppConfigService } from './common/config/app/config.service';
import { BadParameterException } from './common/exceptions/bad-parameter.exception';
import { AllExceptionFilter } from './common/filters/all-exception.filter';

export function setNestApp(app: INestApplication) {
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const appConfigService = app.get(AppConfigService);

  app.useGlobalFilters(new AllExceptionFilter(appConfigService));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadParameterException(Object.values(validationErrors[0].constraints).join(', '));
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableShutdownHooks();
}
