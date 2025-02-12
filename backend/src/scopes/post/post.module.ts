import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Follow } from '../follow/entities/follow.entity';
import { AuthenticationUsers } from '../authenticationUser/entities/authenticationUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, AuthenticationUsers, Follow])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
