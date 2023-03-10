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
import { UpdateArticleDto } from './dto/updateArticle.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articlesService.findAll(currentUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articlesService.getFeed(currentUserId, query);
  }

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

  @Get(':slug')
  @UseGuards(AuthGuard)
  async getBySlug(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
  ): Promise<any> {
    const response = await this.articlesService.getDetailBySlug(
      slug,
      currentUserId,
    );

    const linkImg: string = BASE_URL_BANNER + response.article.banner;
    response.article.banner = linkImg;

    // return this.articlesService.buildArticleResponse(article);
    return response;
  }

  @Put('update/:slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('banner', {
      storage: multer.diskStorage(diskBannerConfig),
    }),
  )
  async updateArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const bannerPath = !!file ? file.filename : null;

    const article = await this.articlesService.updateArticle(
      slug,
      updateArticleDto,
      currentUserId,
      bannerPath,
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

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const articles = await this.articlesService.addArticleToFavorites(
      slug,
      currentUserId,
    );
    return this.articlesService.buildArticleResponse(articles);
  }

  @Delete(':slug/unfavorite')
  @UseGuards(AuthGuard)
  async deleteArticleFromFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articlesService.deleteArticleFromFavorites(
      slug,
      currentUserId,
    );
    return this.articlesService.buildArticleResponse(article);
  }
}
