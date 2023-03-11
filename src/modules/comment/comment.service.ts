import { CommentEntity } from './comment.entity';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DataSource, DeleteResult, Repository } from 'typeorm';

import { CreateCommentDto } from './dto/createComment.dto';
import { ArticleEntity } from '../article/article.entity';
import { UserEntity } from '../user/user.entity';
import { CommentResponseInterface } from './types/commentResponse.interface';
import { BASE_URL_AVA } from '@app/config/common';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    // For typeorm query builder
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getListComment(slug: string): Promise<any> {
    const commentList = await this.commentRepository.find({
      where: {
        articleRoot: {
          slug: slug,
        },
      },
      relations: ['authorComment'],
    });
    const commentCount = commentList.length;
    const configAva = commentList.map((comment) => {
      return {
        ...comment,
        authorComment: {
          ...comment.authorComment,
          avatar: BASE_URL_AVA + comment.authorComment.avatar,
        },
      };
    });
    //   Xóa đi vì hiện dài
    configAva.forEach((comment) => {
      comment.articleRoot = null;
    });

    return { commentList: configAva, commentCount };
  }

  async createComment(
    slug: string,
    currentUser: UserEntity,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    const comment = new CommentEntity();
    Object.assign(comment, createCommentDto);
    comment.authorComment = currentUser;
    comment.articleRoot = article;

    //   Tang lượng comment
    article.commentCount++;
    await this.articleRepository.save(article);

    return await this.commentRepository.save(comment);
  }

  async updateComment(
    slug: string,
    currentUser: UserEntity,
    commentId: number,
    updateCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new HttpException('Comment does not exist', HttpStatus.NOT_FOUND);
    }
    if (currentUser.id !== comment.authorComment.id) {
      throw new HttpException(
        'Users do not have permission to update ',
        HttpStatus.FORBIDDEN,
      );
    }
    Object.assign(comment, updateCommentDto);
    return this.commentRepository.save(comment);
  }

  async deleteComment(
    slug: string,
    currentUser: UserEntity,
    commentId: number,
  ): Promise<DeleteResult> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new HttpException('Comment does not exist', HttpStatus.NOT_FOUND);
    }
    if (currentUser.id !== comment.authorComment.id) {
      throw new HttpException(
        'Users do not have permission to delete ',
        HttpStatus.FORBIDDEN,
      );
    }
    article.commentCount--;
    await this.articleRepository.save(article);

    return await this.commentRepository.delete({
      id: commentId,
    });
  }

  buildCommentResponse(comment: CommentEntity): CommentResponseInterface {
    return { comment };
  }
}
