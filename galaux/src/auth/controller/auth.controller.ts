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
import { AuthService } from '../service/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MicrosoftAuthGuard } from '../guards/microsoft.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/LoginResponse.dto';
import { UserResponseDto } from '../dto/UserResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'testUser123' },
        password: { type: 'string', example: 'mySecretPassword123' }
      }
    }
  })
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('logout')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: { message: { type: 'string', example: 'Logged out successfully' } }
    }
  })
  async logout() {
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('profile')
  @ApiOkResponse({ type: UserResponseDto })
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user);
  }

  @Get('microsoft')
  @UseGuards(MicrosoftAuthGuard)
  async microsoftAuth() { }

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