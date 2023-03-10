import { IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  readonly content: string;
}
