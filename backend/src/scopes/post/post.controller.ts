import {
  Controller,
  HttpCode,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Post as PostEntity } from './entities/post.entity';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    const userId = req.user?.userId;
    const { authorId } = createPostDto;

    if (userId !== authorId) {
      throw new UnauthorizedException(
        'You can only create posts for your own account.',
      );
    }

    return this.postService.create(createPostDto, userId);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ): Promise<PostEntity> {
    const userId = req.user?.userId;
    const userType = req.user?.userType;

    return this.postService.update(updatePostDto, id, userId, userType);
  }

  @Delete(':id')
  @HttpCode(204)
  async removePost(@Param('id') id: string, @Request() req): Promise<void> {
    const userId = req.user?.userId;
    const userType = req.user?.userType;

    return this.postService.remove(id, userId, userType);
  }

  @Get('timeline')
  async getTimeline(@Request() req): Promise<PostEntity[]> {
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userType = req.user?.userType;

    return userType === 'REGULAR'
      ? this.postService.findUserAndFollowedPosts(userId)
      : this.postService.findEveryPost(userId);
  }

  @Get(':userId')
  async getUserPosts(@Param('userId') userId: string): Promise<PostEntity[]> {
    return this.postService.findUserPosts(userId);
  }
}
