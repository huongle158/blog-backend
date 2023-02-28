import {
  Controller,
  Body,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { User } from './decorators/user.decorator';
import { diskStoConfig } from '@app/config/diskStorage';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserResponseInterface } from './types/userResponse.interface';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { BASE_URL_AVA } from '@app/config/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  // @Post('users/login')
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginDto);
    const linkImg: string = BASE_URL_AVA + user.avatar;
    user.avatar = linkImg;
    return this.userService.buildUserResponse(user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async currentUser(
    // @Req() request: ExpressRequest,
    @User() user: UserEntity,
  ): Promise<UserResponseInterface> {
    const linkImg: string = BASE_URL_AVA + user.avatar;
    user.avatar = linkImg;
    return this.userService.buildUserResponse(user);
  }

  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateCurrentUser(
    @User('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDto,
    );
    const linkImg: string = BASE_URL_AVA + user.avatar;
    user.avatar = linkImg;
    return this.userService.buildUserResponse(user);
  }

  @Put('avatar')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: multer.diskStorage(diskStoConfig),
    }),
  )
  async updateAvatar(
    @User('id') currentUserId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateAvatar(
      currentUserId,
      file.filename,
    );
    const linkImg: string = BASE_URL_AVA + user.avatar;
    user.avatar = linkImg;
    return this.userService.buildUserResponse(user);
  }
}
