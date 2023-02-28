if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000/', // Chỉ cho phép domain example.com gửi yêu cầu
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Cho phép sử dụng các phương thức HTTP
    allowedHeaders: 'Content-Type, Accept', // Cho phép sử dụng các header được chỉ định
    credentials: true, // Cho phép sử dụng cookies và headers chứa thông tin xác thực
  }); // Kích hoạt middleware CORS ở đây
  await app.listen(3000);
}
bootstrap();
