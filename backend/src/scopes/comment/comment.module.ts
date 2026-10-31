import { Module } from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { Post } from '../post/entities/post.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post])],
  controllers: [CommentController],
  providers: [CommentService],
})

export class CommentModule {}
