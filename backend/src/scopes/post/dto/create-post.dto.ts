import { IsString, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  content: string;

  @IsUUID()
  @IsNotEmpty()
  authorId: string;
}
