import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
