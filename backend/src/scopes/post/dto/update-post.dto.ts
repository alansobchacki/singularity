import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  content: string;
}
