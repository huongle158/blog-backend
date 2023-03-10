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

import { AuthGuard } from '@app/modules/user/guards/auth.guard';

@Controller('comments')
export class CommentController {}
