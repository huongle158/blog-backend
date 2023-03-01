import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskBannerConfig } from '@app/config/diskStorage';
import { AuthGuard } from '@app/modules/user/guards/auth.guard';
import { ArticlesService } from './article.service';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { BASE_URL_BANNER } from '@app/config/common';
import { ArticleResponseInterface } from './types/articleResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('banner', {
      storage: multer.diskStorage(diskBannerConfig),
    }),
  )
  async createArticle(
    @User() currentUser: UserEntity,
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articlesService.createArticle(
      currentUser,
      createArticleDto,
      file.filename,
    );
    const linkImg: string = BASE_URL_BANNER + article.banner;
    article.banner = linkImg;

    return this.articlesService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    return await this.articlesService.deleteArticle(slug, currentUserId);
  }
}
