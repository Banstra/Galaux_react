import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { UserService } from '../../users/service/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('MICROSOFT_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('MICROSOFT_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('MICROSOFT_CALLBACK_URL'),
      scope: ['user.read'],
      tenant: 'common',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { id, displayName, emails } = profile;
    const email = emails[0].value;


    return await this.userService.findOrCreate({
      microsoftId: id,
      email: email,
      displayName: displayName,
    });
  }
}
