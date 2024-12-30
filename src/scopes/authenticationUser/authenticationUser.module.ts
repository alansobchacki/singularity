import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './authenticationUser.service';
import { UserController } from './authenticationUser.controller';
import { AuthenticationUsers } from './entities/authenticationUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthenticationUsers])],
  controllers: [UserController],
  providers: [UserService],
})

export class AuthenticationUserModule {}
