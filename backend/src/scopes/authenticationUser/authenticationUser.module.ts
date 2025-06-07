import { Module, } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './authenticationUser.service';
import { UserController } from './authenticationUser.controller';
import { AuthenticationUsers } from './entities/authenticationUser.entity';
import { RedisCacheModule } from '../../infrastructure/caching/redis-cache-module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthenticationUsers]),
    RedisCacheModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})

export class AuthenticationUserModule {}
