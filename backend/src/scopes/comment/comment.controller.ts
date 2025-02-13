import { Controller, Post, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    try {
      const commentData = {
        ...createCommentDto,
        userId: req.user?.userId,
      };

      const comment = await this.commentService.create(commentData);
      return {
        success: true,
        message: 'Comment created successfully',
        data: comment,
      };
    } catch {
      throw new HttpException(
        'Failed to create comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
