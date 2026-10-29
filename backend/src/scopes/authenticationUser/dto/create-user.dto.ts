import {
  IsEmail,
  IsString,
  IsOptional,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsString()
  @Length(8, 72)
  password: string;

  @IsString()
  @Length(4, 25)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;
}
