import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('spectator-login')
  async spectatorLogin() {
    const spectatorEmail = process.env.SPECTATOR_EMAIL;
    const spectatorPassword = process.env.SPECTATOR_PASSWORD;

    const user = await this.authService.validateUser(
      spectatorEmail,
      spectatorPassword,
    );

    if (!user) {
      throw new Error('Spectator login failed');
    }

    return this.authService.login(user);
  }
}
