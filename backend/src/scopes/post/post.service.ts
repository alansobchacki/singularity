import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from './entities/post.entity';
import { Follow } from '../follow/entities/follow.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthenticationUsers } from '../authenticationUser/entities/authenticationUser.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(AuthenticationUsers)
    private readonly userRepository: Repository<AuthenticationUsers>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const author = await this.userRepository.findOne({ where: { id: userId } });

    if (!author) {
      throw new Error('User not found');
    }

    const post = this.postRepository.create({
      content: createPostDto.content,
      author,
    });

    return this.postRepository.save(post);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (updatePostDto.content) {
      post.content = updatePostDto.content;
    }

    return this.postRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Post not found');
    }
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async findUserAndFollowedPosts(userId: string): Promise<Post[]> {
    const followedUsers = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });

    const followedUserIds = followedUsers.map((follow) => follow.following.id);
    const userAndFollowedIds = [userId, ...followedUserIds];

    return this.postRepository.find({
      where: { author: { id: In(userAndFollowedIds) } },
      relations: ['author', 'comments', 'likes'],
      order: { createdAt: 'DESC' },
    });
  }
}
