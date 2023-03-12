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
  Delete,
  Req,
  BadGatewayException,
} from '@nestjs/common';
import * as multer from 'multer';
import { IncomingHttpHeaders } from 'http';
import { FileInterceptor } from '@nestjs/platform-express';
// import { AuthGuard } from '@nestjs/passport';
import { Request } from '@nestjs/common';
import CustomAuthGuard from '@app/modules/user/guards/auth.guard';
import { User } from './decorators/user.decorator';
import { diskStoConfig } from '@app/config/diskStorage';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { BASE_URL_AVA } from '@app/config/common';
import { SimpleUserResponseInterface } from './types/simpleUserResponse.interface';
import { LogoutMiddleware } from './middlewares/logout.middleware';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserToken(user);
  }

  // @Post('users/login')
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginDto);
    // const linkImg: string = BASE_URL_AVA + user.avatar;
    // user.avatar = linkImg;
    return this.userService.buildUserToken(user);
  }

  @Get()
  @UseGuards(CustomAuthGuard)
  async currentUser(
    // @Req() request: ExpressRequest,
    @User() user: UserEntity,
  ): Promise<SimpleUserResponseInterface> {
    // const linkImg: string = BASE_URL_AVA + user.avatar;
    // user.avatar = linkImg;
    return this.userService.buildUserResponse(user);
  }

  @Put()
  @UseGuards(CustomAuthGuard)
  @UsePipes(new ValidationPipe())
  async updateCurrentUser(
    @User('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<SimpleUserResponseInterface> {
    console.log("This's ~ updateUserDto update", updateUserDto);
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDto,
    );

    return this.userService.buildUserResponse(user);
  }

  @Post('/logout')
  @UseGuards(CustomAuthGuard)
  async logout(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await new LogoutMiddleware(this.userService).use(req, null, () => {});
    return { message: 'Logout successfully' };
  }

  // @Post('logout')
  // @UseGuards(AuthGuard('jwt'))
  // async logout(@Req() req: Request) {
  //   const authorization = req.headers['authorization'];
  //   if (!authorization || !authorization.startsWith('Bearer ')) {
  //     throw new BadGatewayException('Invalid authorization header');
  //   }
  //   const token = authorization.split(' ')[1];
  //   await this.userService.logout(token);
  //   return { message: 'Logged out successfully' };
  // }

  @Put('avatar')
  @UseGuards(CustomAuthGuard)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: multer.diskStorage(diskStoConfig),
    }),
  )
  async updateAvatar(
    @User('id') currentUserId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SimpleUserResponseInterface> {
    const user = await this.userService.updateAvatar(
      currentUserId,
      file.filename,
    );
    // const linkImg: string = BASE_URL_AVA + user.avatar;
    // user.avatar = linkImg;
    return this.userService.buildUserResponse(user);
  }
}
