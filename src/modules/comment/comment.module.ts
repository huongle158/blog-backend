import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleEntity } from '../article/article.entity';
import { UserEntity } from '../user/user.entity';
import { CommentController } from './comment.controller';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, ArticleEntity, UserEntity]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
