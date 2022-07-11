import { Module } from '@nestjs/common';
import { AppConfigModule } from './common/config/app/config.module';
import { DatabaseModule } from './common/config/database/database.module';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { JwtAuthModule } from './common/modules/jwt-auth/jwt-auth.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, JwtAuthModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
