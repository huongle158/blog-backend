import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly content: string;

  // File img để hiện
  @IsNotEmpty()
  readonly banner: string;

  readonly tagList?: string[];
}
