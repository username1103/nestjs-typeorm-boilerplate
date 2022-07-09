import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashService } from './hash.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, HashService],
})
export class AuthModule {}
