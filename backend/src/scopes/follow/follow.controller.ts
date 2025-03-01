import {
  Controller,
  UseGuards,
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
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get(':userId/followers')
  getAllFollowers(@Param('userId') userId: string) {
    return this.followService.getAllFollowers(userId);
  }

  @Get('requests')
  getAllFollowRequests(@Request() req) {
    return this.followService.getAllFollowRequests(req.user.userId);
  }

  @Get('following')
  getAllFollowingRequests(@Request() req) {
    return this.followService.getAllFollowingRequests(req.user.userId);
  }

  @Post()
  create(@Body() createFollowDto: CreateFollowDto, @Request() req) {
    createFollowDto.followerId = req.user?.userId;

    return this.followService.createFollowRequest(createFollowDto);
  }

  @Put('requests/:id')
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
