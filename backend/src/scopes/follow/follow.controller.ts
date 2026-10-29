import {
  Controller,
  UseGuards,
  Query,
  Get,
  Post,
  Body,
  Param,
  Request,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get(':userId/followers')
  getAllFollowers(@Param('userId') userId: string) {
    return this.followService.getAllFollowers(userId);
  }

  @Get('requests')
  @UseGuards(JwtAuthGuard)
  getAllFollowRequests(@Request() req) {
    return this.followService.getAllFollowRequests(req.user.userId);
  }

  @Get('following')
  @UseGuards(JwtAuthGuard)
  getAllFollowingRequests(@Request() req) {
    return this.followService.getAllFollowingRequests(req.user.userId);
  }

  @Get('is-following')
  @UseGuards(JwtAuthGuard)
  async isFollowingUser(
    @Request() req,
    @Query('followingId') followingId: string,
  ) {
    const followerId = req.user?.userId;

    return this.followService.isFollowing(followerId, followingId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createFollowDto: CreateFollowDto, @Request() req) {
    createFollowDto.followerId = req.user?.userId;

    return this.followService.createFollowRequest(createFollowDto);
  }

  @Put('requests/:id')
  @UseGuards(JwtAuthGuard)
  updateFollowRequest(
    @Param('id') followId: string,
    @Body() updateFollowDto: UpdateFollowDto,
    @Request() req,
  ) {
    updateFollowDto.userId = req.user.userId;
    updateFollowDto.followId = followId;

    return this.followService.updateFollowRequest(updateFollowDto);
  }
}
