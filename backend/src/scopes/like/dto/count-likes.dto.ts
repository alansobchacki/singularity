import { IsUUID } from 'class-validator';

export class CountLikesDto {
  @IsUUID()
  postId?: string;

  @IsUUID()
  commentId?: string;
}
