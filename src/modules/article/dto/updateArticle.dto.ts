import { IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class UpdateArticleDto {
  readonly title: string;

  readonly description: string;

  readonly content: string;

  readonly banner: string;

  @IsOptional()
  @IsArray()
  readonly tagList?: string[];
}
