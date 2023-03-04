import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { unlink } from 'fs';
import { promisify } from 'util';

import { UserEntity } from './user.entity';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from './types/userResponse.interface';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { BASE_URL_AVA } from '@app/config/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    const userByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or Username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id: id },
    });
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: [
        'id',
        'username',
        'password',
        'email',
        'bio',
        'avatar',
        'fullname',
      ],
    });
    if (!user) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    delete user.password;
    return user;
  }

  async updateUser(
    userId: number,
    updatedUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    // const { avatar, ...updatedUserDtoWithoutAvatar } = updatedUserDto;
    Object.assign(user, updatedUserDto);

    return await this.userRepository.save(user);
  }

  async updateAvatar(userId: number, filename: string): Promise<UserEntity> {
    const user = await this.findById(userId);
    if (user.avatar) {
      const oldFile: string = user.avatar;
      await this.deleteOldAvatar(oldFile);
    }
    user.avatar = filename;
    return await this.userRepository.save(user);
  }

  async deleteOldAvatar(filename: string) {
    const filePath: string = join(
      process.cwd(),
      'public',
      'avatars',
      `${filename}`,
    );

    try {
      await promisify(unlink)(filePath);
    } catch (err) {
      console.error(`Error deleting avatar file: ${err}`);
    }
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        avatar: BASE_URL_AVA + user.avatar,
        token: this.generateJwt(user),
      },
    };
  }
}
