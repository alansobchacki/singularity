import { IsNotEmpty, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class RemoveLikeDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsOptional()
  postId?: string;

  @IsUUID()
  @IsOptional()
  commentId?: string;

  @ValidateIf(obj => !obj.postId && !obj.commentId)
  @IsNotEmpty({ message: 'Either postId or commentId must be provided.' })
  dummyField?: string; // This is a dummy field to trigger the validation
}
