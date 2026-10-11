import { Controller, Get, Request, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Request as ExpressRequest, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  microsoftLogin() {
    console.log(
      '🔥 HIT THE MICROSOFT LOGIN ROUTE! Redirecting to Microsoft...',
    );
    // Guard automatically redirects to Microsoft
  }

  @Get('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftCallback(
    @Request() req: ExpressRequest,
    @Res() res: Response,
  ) {
    console.log('🔥 HIT THE MICROSOFT CALLBACK ROUTE!');
    const user = await this.authService.validateMicrosoftUser(req.user);
    const response = await this.authService.login(user);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${response.access_token}`);
  }
}
