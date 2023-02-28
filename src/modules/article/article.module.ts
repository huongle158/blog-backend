import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@app/modules/user/user.entity';
import { ArticleEntity } from './article.entity';
import { ArticleController } from './article.controller';
import { ArticlesService } from './article.service';
import { TagEntity } from '../tag/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity, TagEntity])],
  controllers: [ArticleController],
  providers: [ArticlesService],
})
export class ArticleModule {}
