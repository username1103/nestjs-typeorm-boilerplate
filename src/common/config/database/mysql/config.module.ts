import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getEnvFilePath, isIgnoredEnvFile } from '../../config-option';
import { MysqlConfigService } from './config.service';
import { validate } from './validate';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      ignoreEnvFile: isIgnoredEnvFile(),
      validate,
    }),
  ],
  providers: [MysqlConfigService],
  exports: [MysqlConfigService],
})
export class MysqlConfigModule {}
