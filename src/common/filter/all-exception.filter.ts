import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Response } from 'express';
import { ApiNotFoundException } from '../exception/api-not-found.exception';
import { BadParameterException } from '../exception/bad-parameter.exception';
import { ErrorInfo } from '../exception/error-info';
import { ResponseEntity } from '../response/response-entity';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const convertedExpection = this.convert(exception);
    const responseEntity = this.getResponse(convertedExpection);
    const status = convertedExpection.getStatus();

    response.status(status).json(instanceToPlain(responseEntity));
  }

  convert(exception: Error) {
    if (!(exception instanceof HttpException)) {
      return new InternalServerErrorException();
    }

    // 해당하는 API가 존재하지 않는 경우
    if (exception.constructor.name === NotFoundException.name) {
      return new ApiNotFoundException();
    }

    // Input에러 발생시 컨버팅
    if (exception.constructor.name === BadRequestException.name) {
      return new BadParameterException(exception.message);
    }

    const responseBody = exception.getResponse();

    // 사용자가 정의한 에러가 아닌 경우
    if (!(responseBody instanceof ErrorInfo)) {
      return new InternalServerErrorException();
    }

    // 공개하고 싶지 않은 에러인 경우
    if (responseBody.isHidden) {
      return new InternalServerErrorException();
    }

    return exception;
  }

  getResponse(exception: HttpException) {
    if (exception instanceof InternalServerErrorException) {
      return ResponseEntity.ERROR();
    }

    const response = exception.getResponse() as ErrorInfo<any>;

    return ResponseEntity.ERROR_WITH_DATA(response.message, response.errorCode, response.data);
  }
}
