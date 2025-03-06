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
        comment: commentId ? { id: commentId } : undefined,
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

  async removeLike(
    removeLikeDto: RemoveLikeDto,
  ): Promise<{ message: string; removedLikeId: string }> {
    const { userId, postId, commentId } = removeLikeDto;

    const existingLike = await this.likeRepository.findOne({
      where: {
        user: { id: userId },
        post: postId ? { id: postId } : undefined,
        comment: commentId ? { id: commentId } : undefined,
      },
      relations: ['user', 'post', 'comment'],
    });

    if (!existingLike) {
      throw new Error(
        'Cannot remove like - no like found for the specified user and resource.',
      );
    }

    await this.likeRepository.remove(existingLike);

    return {
      message: 'Like removed successfully',
      removedLikeId: existingLike.id,
    };
  }

  async getAllLikedContent(userId: string) {
    const likes = await this.likeRepository.find({
      where: { user: { id: userId } },
    });

    return likes;
  }
}
