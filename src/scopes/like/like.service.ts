import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { RemoveLikeDto } from './dto/remove-like.dto';
import { CountLikesDto } from './dto/count-likes.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async addLike(createLikeDto: CreateLikeDto): Promise<Like> {
    const { userId, postId, commentId } = createLikeDto;
  
    const existingLike = await this.likeRepository.findOne({
      where: { 
        user: { id: userId }, 
        post: postId ? { id: postId } : undefined, 
        comment: commentId ? { id: commentId } : undefined 
      },
    });
  
    if (existingLike) {
      throw new Error('User already liked this resource.');
    }
  
    const like = this.likeRepository.create({
      user: { id: userId },
      post: postId ? { id: postId } : undefined,
      comment: commentId ? { id: commentId } : undefined,
    });
  
    return this.likeRepository.save(like);
  }

  async removeLike(removeLikeDto: RemoveLikeDto): Promise<void> {
    const { userId, postId, commentId } = removeLikeDto;

    const like = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId }, comment: { id: commentId } },
    });

    if (!like) {
      throw new NotFoundException('Like not found.');
    }

    await this.likeRepository.remove(like);
  }

  async countLikes(countLikesDto: CountLikesDto): Promise<number> {
    const { postId, commentId } = countLikesDto;

    if (!postId && !commentId) {
      throw new NotFoundException('Target resource (post or comment) not specified.');
    }

    return this.likeRepository.count({
      where: { post: { id: postId }, comment: { id: commentId } },
    });
  }
}
