import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFollowDto {
  @IsUUID()
  @IsNotEmpty()
  followerId: string;

  @IsUUID()
  @IsNotEmpty()
  followingId: string;
}
