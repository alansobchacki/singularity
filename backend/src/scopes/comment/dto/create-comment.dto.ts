import {
  IsNotEmpty,
  IsUUID,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateCommentDto {
  userId?: string;

  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  content: string;

  @IsString()
  @IsOptional()
  image?: string;
}
