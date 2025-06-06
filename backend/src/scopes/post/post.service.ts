import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from './entities/post.entity';
import { Follow } from '../follow/entities/follow.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthenticationUsers } from '../authenticationUser/entities/authenticationUser.entity';
import checkToxicity from '../../utils/toxicity-check';

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

    const isToxic = await checkToxicity(createPostDto.content);

    if (isToxic) throw new BadRequestException('Your post is too toxic.');

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

    const isToxic = await checkToxicity(updatePostDto.content);

    if (isToxic) throw new BadRequestException('Your post is too toxic.');

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

  async findEveryPost(userId: string): Promise<Post[]> {
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('post.likes', 'postLike')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .leftJoinAndSelect('comment.likes', 'commentLike')
      .orderBy('post.createdAt', 'DESC')
      .select([
        'post.id',
        'post.content',
        'post.createdAt',
        'post.updatedAt',
        'author.id',
        'author.name',
        'author.profilePicture',
        'author.userType',
        'postLike.id',
        'postLike.userId',
        'comment.id',
        'comment.content',
        'comment.createdAt',
        'commentAuthor.id',
        'commentAuthor.name',
        'commentAuthor.profilePicture',
        'commentAuthor.userType',
        'commentLike.id',
        'commentLike.userId',
      ])
      .getMany();

    for (const post of posts) {
      post.comments.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return posts;
  }

  async findUserAndFollowedPosts(userId: string): Promise<Post[]> {
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const followedUsers = await this.followRepository.find({
      where: { follower: { id: userId }, status: 'ACCEPTED' },
      relations: ['following'],
    });

    const followedUserIds = followedUsers.map((follow) => follow.following.id);
    const userAndFollowedIds = [userId, ...followedUserIds];

    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('post.likes', 'postLike')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .leftJoinAndSelect('comment.likes', 'commentLike')
      .where('post.author.id IN (:...userAndFollowedIds)', {
        userAndFollowedIds,
      })
      .orderBy('post.createdAt', 'DESC')
      .select([
        'post.id',
        'post.content',
        'post.createdAt',
        'post.updatedAt',
        'author.id',
        'author.name',
        'author.profilePicture',

        'postLike.id',
        'postLike.userId',

        'comment.id',
        'comment.content',
        'comment.createdAt',
        'commentAuthor.id',
        'commentAuthor.name',
        'commentAuthor.profilePicture',

        'commentLike.id',
        'commentLike.userId',
      ])
      .getMany();

    for (const post of posts) {
      post.comments.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return posts;
  }

  async findUserPosts(userId: string): Promise<Post[]> {
    if (!userId) {
      throw new UnauthorizedException('No users to get posts from.');
    }

    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('post.likes', 'postLike')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .leftJoinAndSelect('comment.likes', 'commentLike')
      .where('post.author.id = :userId', { userId })
      .orderBy('post.createdAt', 'DESC')
      .select([
        'post.id',
        'post.content',
        'post.createdAt',
        'post.updatedAt',
        'author.id',
        'author.name',
        'author.profilePicture',
        'postLike.id',
        'postLike.userId',
        'comment.id',
        'comment.content',
        'comment.createdAt',
        'commentAuthor.id',
        'commentAuthor.name',
        'commentAuthor.profilePicture',
        'commentLike.id',
        'commentLike.userId',
      ])
      .getMany();

    return posts;
  }
}
