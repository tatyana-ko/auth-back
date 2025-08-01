import { ConfigService } from '@nestjs/config';

export const getEmailConfig = (configService: ConfigService) => ({
  resendApiKey: configService.get<string>('RESEND_API_KEY'),
  emailFrom: configService.get<string>('EMAIL_FROM') || 'onboarding@resend.dev',
  frontendUrl: configService.get<string>('FRONTEND_URL') || 'http://localhost:3000',
});
