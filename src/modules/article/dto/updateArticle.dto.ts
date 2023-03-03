import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateArticleDto {
  readonly title: string;

  readonly content: string;

  @IsOptional()
  @IsArray()
  readonly tagList?: string[];

  // @IsOptional()
  // @IsString()
  // readonly banner?: string;
}
