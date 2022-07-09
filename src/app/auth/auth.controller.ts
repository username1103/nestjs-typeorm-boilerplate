import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { AlreadyExistEmailException } from '../../common/exceptions/already-exist-email.exception';
import { ResponseEntity } from '../../common/response/response-entity';
import { AuthService } from './auth.service';
import { SignupRequestDto } from './dto/signup-request.dto';

@Controller('/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiSuccessResponse(HttpStatus.CREATED)
  @ApiErrorResponse(AlreadyExistEmailException)
  async signup(@Body() signupRequest: SignupRequestDto) {
    await this.authService.signup(signupRequest);

    return ResponseEntity.OK();
  }
}
