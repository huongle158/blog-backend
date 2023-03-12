import { ExpressRequest } from './../../../types/expressRequest.interface';
import { NextFunction, Response } from 'express';
import { NestMiddleware, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user.service';
import { JWT_SECRET } from '@app/config';

@Injectable()
export class LogoutMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequest, _: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    try {
      const decode = verify(token, JWT_SECRET);
      // Nếu token hợp lệ, hãy xóa authorization header
      delete req.headers.authorization;
      next();
    } catch (err) {
      next();
    }
  }
}
