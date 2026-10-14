import {
  Controller,
  Get,
  Request,
  UseGuards,
  Res,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MicrosoftAuthGuard } from './guards/microsoft.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    await new Promise<void>((resolve, reject) =>
      req.logout((err: any) => (err ? reject(err) : resolve())),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Get()
  @UseGuards(MicrosoftAuthGuard)
  async microsoftAuth() {
    // Initiates the Microsoft OAuth2 login flow redirection
  }

  @Get('callback')
  @UseGuards(MicrosoftAuthGuard)
  async microsoftAuthRedirect(@Req() req: any, @Res() res: any) {
    const user = req.user;
    return res.json({
      message: 'User successfully authenticated/registered',
      user,
    });
  }
}
