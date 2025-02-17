import {
  IsEmail,
  IsString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export enum UserType {
  REGULAR = 'REGULAR',
  ADMIN = 'ADMIN',
  SPECTATOR = 'SPECTATOR',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(UserType, {
    message: 'userType must be REGULAR, ADMIN, or SPECTATOR',
  })
  @IsNotEmpty()
  userType: UserType;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsEnum(AccountStatus, {
    message: 'accountStatus must be ACTIVE or SUSPENDED',
  })
  @IsOptional()
  accountStatus?: AccountStatus;
}
