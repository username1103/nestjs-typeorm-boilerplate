import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppConfigService } from '../../app/config.service';
import { MysqlConfigService } from '../mysql/config.service';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    private readonly mysqlConfigService: MysqlConfigService,
    private readonly appConfigService: AppConfigService,
  ) {}

  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const entityPath = path.resolve(__dirname, '../../../../**/*.entity.{js,ts}');

    return {
      type: 'mysql',
      name: connectionName,
      host: this.mysqlConfigService.hostName,
      port: this.mysqlConfigService.port,
      username: this.mysqlConfigService.userName,
      password: this.mysqlConfigService.passwrod,
      database: this.mysqlConfigService.dbName,
      logging: this.appConfigService.isDevelopment() ? 'all' : ['error', 'warn'],
      entities: [entityPath],
      dropSchema: this.appConfigService.isTest(),
      synchronize: !this.appConfigService.isProduction(),
      namingStrategy: new SnakeNamingStrategy(),
      // 단순히 Slow query를 찍어주기만 하고 커넥션을 끊지 않음.
      // 찾아본 결과 mysql 기준 현재 커넥션 타임아웃이 불가능. DB 드라이버 자체에 따라 커넥션 타임아웃이 가능하기도 함.
      maxQueryExecutionTime: this.mysqlConfigService.maxConnectionTimeout,
      timezone: '+00:00', // DBMS Timezone 설정
    };
  }
}
