import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Put,
  Param,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('comment')
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    try {
      const commentData = {
        ...updateCommentDto,
        userId: req.user?.userId,
      };

      const updatedComment = await this.commentService.update(id, commentData);

      return {
        success: true,
        message: 'Comment updated succesfully',
        data: updatedComment,
      };
    } catch {
      throw new HttpException(
        'Failed to update comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('archive/:id')
  async archive(@Param('id') id: string, @Request() req) {
    try {
      const userType = req.user?.userType;

      const archivedComment = await this.commentService.archive(id, userType);

      return {
        success: true,
        message: 'Comment archived succesfully',
        data: archivedComment,
      };
    } catch {
      throw new HttpException(
        'Failed to archive comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
