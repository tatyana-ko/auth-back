import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-yandex';
import { AuthService } from '../auth.service';
import { IYandexProfile, TSocialCallback } from '@/types/socials.types';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('YANDEX_CLIENT_ID')!,
      clientSecret: configService.get<string>('YANDEX_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('YANDEX_CALLBACK_URL')!,
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: IYandexProfile,
    done: TSocialCallback,
  ): Promise<any> {
    done(null, {
      avatarPath: profile.photos[0].value,
      email: profile.emails[0].value,
      name: profile.displayName,
    });
  }
}
