import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  async createFollowRequest(createFollowDto: CreateFollowDto): Promise<Follow> {
    const { followerId, followingId } = createFollowDto;

    const existingFollow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (existingFollow) {
      throw new HttpException(
        'Follow request already exists',
        HttpStatus.CONFLICT,
      );
    }

    const follow = this.followRepository.create({
      follower: { id: followerId },
      following: { id: followingId },
    });

    return this.followRepository.save(follow);
  }

  async getAllFollowers(userId: string) {
    const followers = await this.followRepository.find({
      where: { following: { id: userId }, status: 'ACCEPTED' },
      relations: ['follower'],
    });

    return followers;
  }

  async getAllFollowRequests(userId: string) {
    const followRequests = await this.followRepository.find({
      where: { following: { id: userId }, status: 'PENDING' },
      relations: ['follower'],
    });

    return followRequests;
  }

  async updateFollowRequest(updateFollowDto: UpdateFollowDto): Promise<Follow> {
    const { userId, followId, followStatus } = updateFollowDto;

    const follow = await this.followRepository.findOne({
      where: { follower: { id: followId } },
    });

    if (!follow) {
      throw new HttpException('Follow request not found', HttpStatus.NOT_FOUND);
    }

    if (follow.following.id !== userId) {
      throw new HttpException(
        'You are not authorized to update this request',
        HttpStatus.FORBIDDEN,
      );
    }

    follow.status = followStatus;

    return this.followRepository.save(follow);
  }
}
