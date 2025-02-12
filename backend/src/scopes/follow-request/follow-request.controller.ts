import { Controller, Post, Get, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { FollowRequestService } from './follow-request.service';
import { FollowRequest } from './entities/follow-request.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('follow-request')
@UseGuards(JwtAuthGuard)
export class FollowRequestController {
  constructor(private readonly followRequestService: FollowRequestService) {}

  @Post()
  async sendFollowRequest(
    @Body('requesterId') requesterId: string,
    @Body('receiverId') receiverId: string,
  ): Promise<FollowRequest> {
    return this.followRequestService.sendFollowRequest(requesterId, receiverId);
  }

  @Get(':userId')
  async getFollowRequests(@Param('userId') userId: string): Promise<FollowRequest[]> {
    return this.followRequestService.getFollowRequests(userId);
  }

  @Patch(':requestId')
  async respondToFollowRequest(
    @Param('requestId') requestId: string,
    @Body('status') status: 'ACCEPTED' | 'DECLINED',
  ): Promise<FollowRequest> {
    return this.followRequestService.respondToFollowRequest(requestId, status);
  }
}
