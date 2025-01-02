import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { AuthenticationUsers } from '../authenticationUser/entities/authenticationUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, AuthenticationUsers])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
