import { ExpressRequest } from './../../../types/expressRequest.interface';
import { NextFunction, Response } from 'express';
import { NestMiddleware, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user.service';
import { JWT_SECRET } from '@app/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequest, _: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    try {
      const decode = verify(token, JWT_SECRET);
      const user = await this.userService.findById(decode.id);
      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
