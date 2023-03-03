import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type, Transform } from 'class-transformer';

import { UserEntity } from '../user/user.entity';

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  content: string;

  @Column({ default: '' })
  banner: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // @Column('simple-array')
  // tagList: string[];

  // @Transform(({ value }) => {
  //   try {
  //     return JSON.parse(value);
  //   } catch {
  //     return value;
  //   }
  // })
  // @Type(() => String)
  @Column('simple-array')
  tagList: string[];

  @Column({ default: 0 })
  favoritesCount: number;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => UserEntity, (user) => user.articles, { eager: true })
  author: UserEntity;
}
