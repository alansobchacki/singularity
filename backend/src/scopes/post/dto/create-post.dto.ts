import { IsString, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;

  @IsUUID()
  @IsNotEmpty()
  authorId: string;
}
