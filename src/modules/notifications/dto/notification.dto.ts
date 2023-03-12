import { IsNotEmpty } from 'class-validator';

export class NotificationDto {
  @IsNotEmpty()
  authorId: number;

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  articleId: number;
}
