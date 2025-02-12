import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowRequest } from './entities/follow-request.entity';
// import { AuthenticationUsers } from '../authenticationUser/entities/authenticationUser.entity';

@Injectable()
export class FollowRequestService {
  constructor(
    @InjectRepository(FollowRequest)
    private readonly followRequestRepository: Repository<FollowRequest>,
  ) {}

  // Create a new follow request
  async sendFollowRequest(requesterId: string, receiverId: string): Promise<FollowRequest> {
    const requester = '';
    const receiver = '';

    if (!requester || !receiver) {
      throw new Error('Requester or Receiver not found');
    }

    const followRequest = this.followRequestRepository.create({
      requester,
      receiver,
      status: 'PENDING',
    });

    return this.followRequestRepository.save(followRequest);
  }

  // Get all follow requests for a user
  async getFollowRequests(userId: string): Promise<FollowRequest[]> {
    return this.followRequestRepository.find({
      where: [
        { requester: { id: userId } },
        { receiver: { id: userId } },
      ],
      relations: ['requester', 'receiver'],
    });
  }

  // Respond to a follow request (accept or decline)
  async respondToFollowRequest(requestId: string, status: 'ACCEPTED' | 'DECLINED'): Promise<FollowRequest> {
    const followRequest = await this.followRequestRepository.findOne({
      where: { id: requestId },
      relations: ['requester', 'receiver'],
    });

    if (!followRequest) {
      throw new Error('Follow request not found');
    }

    followRequest.status = status;

    return this.followRequestRepository.save(followRequest);
  }
}
