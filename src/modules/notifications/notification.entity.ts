import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleEntity } from '../article/article.entity';
import { UserEntity } from '../user/user.entity';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user: UserEntity;

  @Column()
  message: string;

  @ManyToOne(() => ArticleEntity, (article) => article.notifications)
  article: ArticleEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
