import { UserType } from '@app/modules/user/types/user.type';
import { ArticleType } from './article.type';

export interface ArticlesResponseInterface {
  articles: ArticleType[];
  articlesCount: number;
  author?: UserType;
}
