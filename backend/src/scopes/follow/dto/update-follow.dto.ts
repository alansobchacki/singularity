import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator';

export enum FollowStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class UpdateFollowDto {
  followId: string;
  userId: string;

  @IsEnum(FollowStatus, {
    message: 'Status must be ACCEPTED or REJECTED',
  })
  @IsNotEmpty()
  followStatus: FollowStatus;
}
