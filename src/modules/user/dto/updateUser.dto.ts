import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  readonly username: string;

  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsOptional()
  readonly bio: string;

  @IsOptional()
  readonly fullname: string;
}
