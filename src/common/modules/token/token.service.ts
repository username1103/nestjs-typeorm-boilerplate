import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import moment, { Moment } from 'moment';
import { Repository } from 'typeorm';
import { User } from '../../../app/user/user.entity';
import { JwtConfigService } from '../../config/jwt/config.service';
import { InvalidTokenException } from '../../exceptions/invalid-token.exception';
import { Token } from './token.entity';
import { TokenPayload } from './type/token-payload';
import { TokenType } from './type/token-type';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  private generateToken(sub: number, exp: Moment, type: TokenType) {
    const payload: TokenPayload = {
      sub,
      iat: moment().unix(),
      exp: exp.unix(),
      type: type.code,
    };
    return this.jwtService.sign(payload);
  }

  async generateAuthToken(user: User) {
    const accessTokenExpires = moment().add(this.jwtConfigService.accessTokenExpireMinutes, 'minutes');
    const accessToken = this.generateToken(user.id, accessTokenExpires, TokenType.ACCESS);

    const refreshTokenExpires = moment().add(this.jwtConfigService.refreshTokenExpireDays, 'days');
    const refreshToken = this.generateToken(user.id, refreshTokenExpires, TokenType.REFRESH);

    const token = Token.of(refreshToken, TokenType.REFRESH, user);
    await this.tokenRepository.save(token);

    return {
      accessToken,
      refreshToken,
      userId: user.id,
    };
  }

  verifyRefreshToken(token: string, tokenType: TokenType) {
    try {
      const payload = this.jwtService.verify(token);
      const convertedPaylaod = plainToInstance(TokenPayload, payload);

      if (!tokenType.equals(convertedPaylaod.type)) {
        throw new Error('Invalid Token Type');
      }

      // TODO: 리프레시 토큰을 데이터베이스에 저장하게 된다면 TokenService내에서 또는 다른 Service내에서 처리가 필요하다

      return payload;
    } catch (e) {
      throw new InvalidTokenException();
    }
  }
}
