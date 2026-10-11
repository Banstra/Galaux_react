import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {UserService} from '../users/service/user/user.service';
import { CreateUserParams } from '../utils/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateMicrosoftUser(profile: any) {
    const microsoftId = profile.id;

    // 1. Check if user exists
    let user = await this.usersService.findByMicrosoftId(microsoftId);

    // 2. If not, create them using your new Type
    if (!user) {
      const email =
        profile.emails?.[0]?.value || `${microsoftId}@placeholder.local`;

      const createParams: CreateUserParams = {
        username: profile.displayName || 'MinecraftPlayer',
        login: email, // Using email as the login identifier
        email: email,
        microsoftId: microsoftId,
        profile_info: 'New Minecraft Player', // Default bio
      };

      user = await this.usersService.createUser(createParams);
    }

    // 3. Update their tokens so the launcher can use them later
    if (profile.accessToken && profile.refreshToken) {
      await this.usersService.updateTokens(
        microsoftId,
        profile.accessToken,
        profile.refreshToken,
      );
    }

    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, microsoftId: user.microsoftId };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}
