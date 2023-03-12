// import { Controller, Post, UseGuards, Req } from '@nestjs/common';
// import { CustomAuthGuard } from './guards/custom-auth.guard';
// import { RevokedTokenService } from './revoked-token.service';

// @Controller()
// export class AuthController {
//   constructor(private readonly revokedTokenService: RevokedTokenService) {}

//   @Post('/logout')
//   @UseGuards(CustomAuthGuard)
//   async logout(@Req() req) {
//     const token = req.headers.authorization.split(' ')[1];
//     await this.revokedTokenService.add(token);
//     return { message: 'Logout successfully' };
//   }
// }

// Middleware
