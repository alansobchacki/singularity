import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

    if (!author) throw new Error('User not found');

    const post = this.postRepository.create({
      content: createPostDto.content,
      author,
    });

    return this.postRepository.save(post);
  }

  async update(
    updatePostDto: UpdatePostDto,
    id: string,
    userId: string,
    userType: string,
  ): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) throw new NotFoundException('Post not found');

    if (post.author.id === userId || userType === 'ADMIN') {
      if (updatePostDto.content) post.content = updatePostDto.content;

      return this.postRepository.save(post);
    } else {
      throw new UnauthorizedException('You can only edit your own posts');
    }
  }

  async remove(id: string, userId: string, userType: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) throw new NotFoundException('Post not found');

    if (post.author.id === userId || userType === 'ADMIN') {
      await this.postRepository.delete(id);
    } else {
      throw new UnauthorizedException('You can only delete your own posts');
    }
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
