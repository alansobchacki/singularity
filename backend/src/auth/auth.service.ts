import { Injectable, ForbiddenException } from '@nestjs/common';
import { UserService } from '../scopes/authenticationUser/authenticationUser.service';
import { FindUserByEmailDto } from '../scopes/authenticationUser/dto/find-user-by-email.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const findUserByEmailDto: FindUserByEmailDto = { email };
    const user = await this.usersService.findByEmail(findUserByEmailDto);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    if (user.accountStatus === 'SUSPENDED') {
      throw new ForbiddenException('This account is suspended');
    }

    return { ...user, password: undefined };
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      userEmail: user.email,
      userType: user.userType,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
