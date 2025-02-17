import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator';

export enum FollowStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class UpdateFollowDto {
  @IsUUID()
  @IsNotEmpty()
  followId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(FollowStatus, {
    message: 'Status must be ACCEPTED or REJECTED',
  })
  @IsNotEmpty()
  followStatus: FollowStatus;
}
