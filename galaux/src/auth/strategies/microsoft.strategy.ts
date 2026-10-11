import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {Strategy} from 'passport';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor() {
    super();
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    // The 'profile' object contains the user info from Microsoft
    const userPayload = {
      id: profile.id,
      displayName: profile.displayName,
      username: profile.displayName || 'MinecraftPlayer',
      emails: profile.emails,
      accessToken, // Save these so we can store them in the database!
      refreshToken,
    };

    // Pass the payload to the AuthService validateMicrosoftUser method
    return done(null, userPayload);
  }
}
