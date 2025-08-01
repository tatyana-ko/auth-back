import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
  }

  sendEmail() {}

  async sendVerification(email: string, token: string) {
    const verifyUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

    const { data, error } = await this.resend.emails.send({
      from: this.configService.get('EMAIL_FROM') || 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email address',
      html: `
        <p>Click the link to verify your email:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
      `,
    });

    if (error) {
      console.error(error);
      throw new Error('Failed to send email');
    }

    return data;
  }
}
