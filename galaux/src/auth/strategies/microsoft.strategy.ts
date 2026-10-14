import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private configService: ConfigService) {
    super({
      // Используем get<string>() и утверждаем тип as string, чтобы удовлетворить TypeScript
      clientID: configService.get<string>('MICROSOFT_CLIENT_ID') as string,
      clientSecret: configService.get<string>(
        'MICROSOFT_CLIENT_SECRET',
      ) as string,
      callbackURL: configService.get<string>(
        'MICROSOFT_CALLBACK_URL',
      ) as string,
      scope: ['XboxLive.signin', 'offline_access'],
    });
  }

  // В NestJS мы просто возвращаем объект, а фреймворк сам передает его в AuthService
  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      microsoftId: profile.id,
      displayName: profile.displayName || 'MinecraftPlayer',
      emails: profile.emails,
      accessToken,
      refreshToken,
    };
  }
}
