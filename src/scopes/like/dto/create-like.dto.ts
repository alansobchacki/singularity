import { IsNotEmpty, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class CreateLikeDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsOptional()
  postId?: string;

  @IsUUID()
  @IsOptional()
  commentId?: string;

  @ValidateIf(o => !o.postId && !o.commentId) // Enforce at least one
  @IsNotEmpty({ message: 'Either postId or commentId must be provided.' })
  dummyField?: string; // This is a dummy field to trigger the validation
}
