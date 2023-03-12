import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import AuthGuard from './guards/auth.guard';
import { ArticleEntity } from '@app/modules/article/article.entity';
import { CommentEntity } from '../comment/comment.entity';
import { NotificationEntity } from '../notifications/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ArticleEntity,
      CommentEntity,
      NotificationEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [UserService],
})
export class UserModule {}
