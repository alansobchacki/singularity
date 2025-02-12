import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowRequestService } from './follow-request.service';
import { FollowRequestController } from './follow-request.controller';
import { FollowRequest } from './entities/follow-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FollowRequest]), 
  ],
  controllers: [FollowRequestController],
  providers: [FollowRequestService],
})
export class FollowRequestModule {}
