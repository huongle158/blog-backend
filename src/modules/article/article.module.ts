import { NotificationModule } from './../notifications/notification.module';
import { NotificationEntity } from './../notifications/notification.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@app/modules/user/user.entity';

import { ArticleEntity } from './article.entity';
import { ArticleController } from './article.controller';
import { ArticlesService } from './article.service';
import { TagEntity } from '../tag/tag.entity';
import { FollowEntity } from '../profile/follow.entity';
import { CommentEntity } from '../comment/comment.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      UserEntity,
      TagEntity,
      FollowEntity,
      CommentEntity,
      // NotificationEntity,
    ]),
    // NotificationModule,
  ],
  controllers: [ArticleController],
  providers: [ArticlesService, UserService],
  exports: [ArticlesService],
})
export class ArticleModule {}
