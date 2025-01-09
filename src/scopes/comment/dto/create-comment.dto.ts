import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreateCommentDto {
  userId?: string;

  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
