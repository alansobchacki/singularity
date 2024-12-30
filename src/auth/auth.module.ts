import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticationUserModule } from '../scopes/authenticationUser/authenticationUser.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [AuthenticationUserModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})

export class AuthModule {}
