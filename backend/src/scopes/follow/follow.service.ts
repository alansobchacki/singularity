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

    if (followerId === followingId) {
      throw new HttpException(
        'You cannot follow yourself',
        HttpStatus.CONFLICT,
      );
    }

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
      relations: ['follower', 'following'],
    });

    return followRequests;
  }

  async getAllFollowingRequests(userId: string) {
    const followingRequests = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
      select: {
        id: true,
        following: { id: true },
      },
    });

    return followingRequests;
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
        status: 'ACCEPTED',
      },
    });

    return !!follow;
  }

  async updateFollowRequest(updateFollowDto: UpdateFollowDto): Promise<Follow> {
    const { userId, followId, followStatus } = updateFollowDto;

    const follow = await this.followRepository.findOne({
      where: { id: followId },
      relations: ['follower', 'following'],
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
