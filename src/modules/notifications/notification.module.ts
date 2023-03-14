import { UserService } from './../user/user.service';
import { UserModule } from '@app/modules/user/user.module';
import { ArticleModule } from '@app/modules/article/article.module';
import { ArticleEntity } from './../article/article.entity';
import { NotificationEntity } from './notification.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { UserEntity } from '../user/user.entity';
import { ArticlesService } from '../article/article.service';
import { FollowEntity } from '../profile/follow.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationEntity,
      ArticleEntity,
      UserEntity,
      FollowEntity,
    ]),
    forwardRef(() => ArticleModule),
    forwardRef(() => UserModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, ArticlesService, UserService],
  exports: [NotificationService],
})
export class NotificationModule {}