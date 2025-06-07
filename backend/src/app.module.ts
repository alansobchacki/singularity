import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './infrastructure/data-source';
import { AuthenticationUserModule } from './scopes/authenticationUser/authenticationUser.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { PostModule } from './scopes/post/post.module';
import { LikeModule } from './scopes/like/like.module';
import { CommentModule } from './scopes/comment/comment.module';
import { FollowModule } from './scopes/follow/follow.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthenticationUserModule,
    AuthModule,
    PostModule,
    LikeModule,
    CommentModule,
    FollowModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    CacheModule.register()
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
