import { Module } from '@nestjs/common';
import { FollowRequestService } from './follow-request.service';
import { FollowRequestController } from './follow-request.controller';

@Module({
  controllers: [FollowRequestController],
  providers: [FollowRequestService],
})
export class FollowRequestModule {}
