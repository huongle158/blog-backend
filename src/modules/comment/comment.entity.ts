import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type, Transform } from 'class-transformer';
import { UserEntity } from '../user/user.entity';
import { ArticleEntity } from '../article/article.entity';

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => UserEntity, (user) => user.comments, { eager: true })
  authorComment: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.commentList, {
    eager: true,
  })
  articleRoot: UserEntity;
}
