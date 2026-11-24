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
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';



@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' }
      }
    }
  })
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('logout')
  async logout() {
    // Для JWT-аутентификации этот эндпоинт не требует очистки сессии на сервере (её нет).
    // Реальный выход происходит на клиенте: фронтенд удаляет токен из localStorage/cookie.
    // Убрала req.logout() и LocalAuthGuard, так как они предназначены для сессионной аутентификации
    // и вызывали ошибки "Login sessions require session support".
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Get('microsoft')
  @UseGuards(MicrosoftAuthGuard)
  async microsoftAuth() {
  }

  @Get('microsoft/callback')
  @UseGuards(MicrosoftAuthGuard)
  async microsoftAuthRedirect(@Req() req: any, @Res() res: any) {
    const user = req.user;

    const payload = {
      id: user.id,
      username: user.username,
      microsoftId: user.microsoftId,
    };
    const access_token = this.authService['jwtService'].sign(payload);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/auth/callback?token=${access_token}`);
  }
}
