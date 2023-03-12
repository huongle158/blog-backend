// import { Injectable } from '@nestjs/common';
// // import { RedisService } from 'nestjs-redis';

// @Injectable()
// export class RevokedTokenService {
//   private readonly REVOKED_TOKENS_KEY = 'revoked_tokens';

//   constructor(private readonly redisService: RedisService) {}

//   async add(token: string) {
//     const client = await this.redisService.getClient();
//     await client.sadd(this.REVOKED_TOKENS_KEY, token);
//   }

//   async exists(token: string) {
//     const client = await this.redisService.getClient();
//     return client.sismember(this.REVOKED_TOKENS_KEY, token);
//   }
// }
