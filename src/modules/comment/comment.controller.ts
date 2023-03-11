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
  ParseIntPipe,
} from '@nestjs/common';

import { AuthGuard } from '@app/modules/user/guards/auth.guard';
import { CommentService } from './comment.service';
import { UserEntity } from '../user/user.entity';
import { User } from '../user/decorators/user.decorator';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentResponseInterface } from './types/commentResponse.interface';
import { NotificationService } from '../notifications/notification.service';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly notificationService: NotificationService,
  ) { }

  @Get('list/:slug')
  async getListComment(@Param('slug') slug: string): Promise<any> {
    return await this.commentService.getListComment(slug);
  }

  @Post('create/:slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createComment(
    @User() currentUser: UserEntity,
    @Param('slug') slug: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseInterface> {
    const comment = await this.commentService.createComment(
      slug,
      currentUser,
      createCommentDto,
    );
    const message = ' đã bình luận bài viết '
    await this.notificationService.createNotification(slug, currentUser.id, message)

    return this.commentService.buildCommentResponse(comment);
  }

  @Put('update/:slug/:commentId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateComment(
    @User() currentUser: UserEntity,
    @Param('slug') slug: string,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: CreateCommentDto,
  ) {
    return await this.commentService.updateComment(
      slug,
      currentUser,
      commentId,
      updateCommentDto,
    );
  }

  @Delete('delete/:slug/:commentId')
  @UseGuards(AuthGuard)
  async deleteComment(
    @User() currentUser: UserEntity,
    @Param('slug') slug: string,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return await this.commentService.deleteComment(
      slug,
      currentUser,
      commentId,
    );
  }
}
