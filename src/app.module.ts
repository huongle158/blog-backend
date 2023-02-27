import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormconfig from '@app/ormconfig';
import { TagModule } from '@app/modules/tag/tag.module';
import { UserModule } from '@app/modules/user/user.module';
import { AuthMiddleware } from '@app/modules/user/middlewares/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...ormconfig, autoLoadEntities: true }),
    TagModule,
    UserModule,
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
