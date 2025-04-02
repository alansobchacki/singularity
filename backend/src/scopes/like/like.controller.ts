import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode
} from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateLikeDto } from './dto/create-like.dto';
import { RemoveLikeDto } from './dto/remove-like.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Get()
  async userLikedContent(@Request() req) {
    return this.likeService.getAllLikedContent(req.user.userId);
  }

  @Post()
  async addLike(@Body() createLikeDto: CreateLikeDto, @Request() req) {
    createLikeDto.userId = req.user?.userId;

    return this.likeService.addLike(createLikeDto);
  }

  @Delete()
  @HttpCode(204)
  async removeLike(
    @Body() removeLikeDto: RemoveLikeDto,
    @Request() req,
  ): Promise<void> {
    removeLikeDto.userId = req.user?.userId;
    await this.likeService.removeLike(removeLikeDto);
  }
}
