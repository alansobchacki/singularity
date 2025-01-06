import { IsNotEmpty, IsUUID } from 'class-validator';

export class RemoveLikeDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @IsUUID()
  commentId?: string;
}
