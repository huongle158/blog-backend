import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormconfig from '@app/ormconfig';
import { TagModule } from '@app/modules/tag/tag.module';
import { UserModule } from '@app/modules/user/user.module';
import { AuthMiddleware } from '@app/modules/user/middlewares/auth.middleware';
import { ArticleModule } from '@app/modules/article/article.module';
import { ProfileModule } from './modules/profile/profile.module';
import { CommentModule } from './modules/comment/comment.module';
import { NotificationModule } from './modules/notifications/notification.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...ormconfig, autoLoadEntities: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public', 'avatars'),
      serveRoot: '/avatars',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public', 'banners'),
      serveRoot: '/banners',
    }),
    TagModule,
    UserModule,
    ArticleModule,
    ProfileModule,
    CommentModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
