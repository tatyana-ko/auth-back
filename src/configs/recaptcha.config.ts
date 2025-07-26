import { isDev } from '@/utils/is-dev.util';
import { ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha';

export const getRecaptchaConfig = async (
  configService: ConfigService,
): Promise<GoogleRecaptchaModuleOptions> => ({
  secretKey: configService.get<string>('RECAPTCHA_SECRET_KEY'),
  response: (req) => req.headers.recaptcha,
  skipIf: isDev(configService),
  debug: isDev(configService),
});
