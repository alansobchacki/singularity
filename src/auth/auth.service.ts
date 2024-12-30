import { Injectable } from '@nestjs/common';
import { UserService } from '../scopes/authenticationUser/authenticationUser.service';
import { FindUserByEmailDto } from '../scopes/authenticationUser/dto/find-user-by-email.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const findUserByEmailDto: FindUserByEmailDto = { email };
    const user = await this.usersService.findByEmail(findUserByEmailDto);
  
    if (user && await bcrypt.compare(password, user.password)) {
      return { ...user, password: undefined };
    }

    return null;
  }
}
