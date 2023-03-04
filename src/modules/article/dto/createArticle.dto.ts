import { IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import * as multer from 'multer';
import { Type, Transform } from 'class-transformer';
export class CreateArticleDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly content: string;

  // File img để hiện
  // @IsNotEmpty()
  // readonly banner: Express.Multer.File;

  // @Transform(({ value }) => {
  //   if (typeof value === 'string') {
  //     try {
  //       return JSON.parse(value);
  //     } catch {
  //       return value;
  //     }
  //   } else {
  //     return value;
  //   }
  // })
  // @IsArray()
  // @Type(() => String)
  // readonly tagList?: string[];

  @IsOptional()
  // @IsArray()
  readonly tagList?: string[];
}
