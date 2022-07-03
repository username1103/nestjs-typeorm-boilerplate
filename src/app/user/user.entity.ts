import { Column } from 'typeorm';
import { BaseEntity } from '../../common/base-entity';

export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
