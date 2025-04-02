import { IsNotEmpty, IsOptional, IsUUID, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The id of the post you want to like'
  })
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
