import { IsEmail } from 'class-validator';

export class UpdateUserDto {
  readonly username: string;

  @IsEmail()
  readonly email: string;

  readonly bio: string;

  readonly fullname: string;

  // readonly avatar: string;

  // readonly cover: string;
}
