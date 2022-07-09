import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base-entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
