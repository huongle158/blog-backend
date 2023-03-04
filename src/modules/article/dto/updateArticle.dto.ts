import { IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import * as multer from 'multer';
import { Type, Transform } from 'class-transformer';
export class UpdateArticleDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly content: string;

  @IsOptional()
  // @IsArray()
  readonly tagList?: string[];
}
