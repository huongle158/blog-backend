import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { join } from 'path';
import { unlink } from 'fs';
import { promisify } from 'util';

import { UserEntity } from '../user/user.entity';
import { BASE_URL_BANNER, BASE_URL_AVA } from './../../config/common';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { UpdateArticleDto } from './dto/updateArticle.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    // For typeorm query builder
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface | any> {
    // Typeorm query builder
    // Tự thêm truy vấn articles vì cta tự tạo query
    // alias của article entity là articles và alias bảng liên kết thông qua trường author có alias là author => ngầm hiểu user entity
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .addSelect(['author.avatar']);
    // .addSelect(`CONCAT('${BASE_URL_AVA}', author.avatar)`, 'avatar');
    if (query.tag) {
      const tagLowerCase = query.tag.toLowerCase();
      queryBuilder.andWhere('LOWER(articles.tagList) LIKE :tag', {
        tag: `%${tagLowerCase}%`,
      });
    }
    if (query.title) {
      const titleLowerCase = query.title.toLowerCase();
      queryBuilder.andWhere('LOWER(articles.title) LIKE :titles', {
        titles: `%${titleLowerCase}%`,
      });
    }
    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author },
      });
      queryBuilder.andWhere('articles.authorId = :id', { id: author.id });
    }
    // Favorited còn sót
    // TODO

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    // SỐ bản ghi bị bỏ qua từ dầu, ví dụ nếu muốn lấy 21 thì offset=20
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    // TODO bo sung favorites
    const articles = await queryBuilder.getMany();
    const configBannerFile = articles.map((article) => {
      const updatedAuthor = {
        ...article.author,
        avatar: BASE_URL_AVA + article.author.avatar,
      };
      return {
        ...article,
        author: updatedAuthor,
        banner: BASE_URL_BANNER + article.banner,
      };
    });
    return {
      articles: configBannerFile,
      articlesCount,
    };
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
    bannerFile: string,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }
    article.banner = bannerFile;
    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser;

    return await this.articleRepository.save(article);
  }

  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException(
        'You are not an author of article',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    slug: string,
    updateArticleDto: UpdateArticleDto,
    currentUserId: number,
    bannerFile?: string,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException(
        'You are not an author of article',
        HttpStatus.FORBIDDEN,
      );
    }
    Object.assign(article, updateArticleDto);

    if (bannerFile) {
      const oldFile: string = article.banner;
      await this.deleteOldBanner(oldFile);
      article.banner = bannerFile;
    }

    return this.articleRepository.save(article);
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({
      where: { slug },
    });
  }

  async deleteOldBanner(filename: string) {
    const filePath: string = join(
      process.cwd(),
      'public',
      'banners',
      `${filename}`,
    );

    try {
      await promisify(unlink)(filePath);
    } catch (err) {
      console.error(`Error deleting avatar file: ${err}`);
    }
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return {
      article,
    };
  }
}
