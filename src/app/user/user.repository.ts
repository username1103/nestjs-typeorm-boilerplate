import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserNotFoudnException } from '../../common/exception/user-not-found.exception';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }

  async getByIdOrFail(id: number): Promise<User> {
    const user = await this.findOneBy({ id });
    if (!user) {
      throw new UserNotFoudnException();
    }

    return user;
  }
}