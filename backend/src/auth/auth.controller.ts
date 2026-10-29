import {
  Controller,
  Request,
  Post,
  UseGuards,
  Res,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { authCookieName, authCookieOptions, authCookieMaxAge } from './constants';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    return this.startSession(req.user, res);
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(authCookieName, authCookieOptions);
  }

  private async startSession(user, res: Response) {
    const { access_token } = await this.authService.login(user);

    res.cookie(authCookieName, access_token, {
      ...authCookieOptions,
      maxAge: authCookieMaxAge,
    });

    return { id: user.id, userType: user.userType };
  }
}
