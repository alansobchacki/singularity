import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthenticationUsers } from '../authenticationUser/entities/authenticationUser.entity';
// Toxicity check disabled: Perspective API sunsets on 2026-12-31.
// import checkToxicity from '../../utils/toxicity-check';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(AuthenticationUsers)
    private readonly userRepository: Repository<AuthenticationUsers>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const author = await this.userRepository.findOne({ where: { id: userId } });

    if (!author) throw new Error('User not found');

    // const isToxic = await checkToxicity(createPostDto.content);

    // if (isToxic) throw new BadRequestException('Your post is too toxic.');

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
    const post = await this.findPostWithAuthor(id);
    const isAuthor = post.author.id === userId;

    // const isToxic = await checkToxicity(updatePostDto.content);

    // if (isToxic) throw new BadRequestException('Your post is too toxic.');

    if (!isAuthor && userType !== 'ADMIN') {
      throw new UnauthorizedException('You can only edit your own posts');
    }

    post.content = updatePostDto.content;
    post.editedBy = isAuthor ? 'AUTHOR' : 'MODERATION';

    return this.postRepository.save(post);
  }

  async remove(id: string, userId: string, userType: string): Promise<void> {
    const post = await this.findPostWithAuthor(id);

    if (post.author.id === userId) {
      await this.postRepository.delete(id);
    } else if (userType === 'ADMIN') {
      post.isDeleted = true;
      await this.postRepository.save(post);
    } else {
      throw new UnauthorizedException('You can only delete your own posts');
    }
  }

  async pin(id: string, isPinned: boolean, userType: string): Promise<Post> {
    if (userType !== 'ADMIN') {
      throw new ForbiddenException('Only admins can pin posts');
    }

    const post = await this.findPostWithAuthor(id);
    post.isPinned = isPinned;

    return this.postRepository.save(post);
  }

  async setCommentsDisabled(
    id: string,
    commentsDisabled: boolean,
    userId: string,
    userType: string,
  ): Promise<Post> {
    const post = await this.findPostWithAuthor(id);

    if (post.author.id !== userId && userType !== 'ADMIN') {
      throw new UnauthorizedException('You can only change your own posts');
    }

    post.commentsDisabled = commentsDisabled;

    return this.postRepository.save(post);
  }

  async findEveryPost(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: Post[]; nextPage: number | null }> {
    const [posts, total] = await this.postsQuery()
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      posts: this.prepareForDisplay(posts),
      nextPage: page * limit < total ? page + 1 : null,
    };
  }

  async findUserPosts(userId: string): Promise<Post[]> {
    if (!userId) {
      throw new UnauthorizedException('No users to get posts from.');
    }

    const posts = await this.postsQuery()
      .where('post.author.id = :userId', { userId })
      .getMany();

    return this.prepareForDisplay(posts);
  }

  private async findPostWithAuthor(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['author'],
    });

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  private postsQuery() {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('post.likes', 'postLike')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .leftJoinAndSelect('comment.likes', 'commentLike')
      .orderBy('post.isPinned', 'DESC')
      .addOrderBy('post.createdAt', 'DESC')
      .select([
        'post.id',
        'post.content',
        'post.isPinned',
        'post.isDeleted',
        'post.commentsDisabled',
        'post.editedBy',
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
      ]);
  }

  private prepareForDisplay(posts: Post[]): Post[] {
    for (const post of posts) {
      if (post.isDeleted) {
        post.content = '';
        post.comments = [];
        post.likes = [];
      }

      post.comments.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return posts;
  }
}
