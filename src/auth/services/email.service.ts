import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { buildVerificationEmailHtml } from '../templates/verification-email.template';
import { buildPasswordResetEmailHtml } from '../templates/password-reset-email.template';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly from: string;
  private readonly isDev: boolean;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
    this.from = this.configService.get<string>(
      'RESEND_FROM',
      'onboarding@resend.dev',
    );
    this.isDev = this.configService.get<string>('NODE_ENV') !== 'production';
  }

  async sendVerificationEmail(to: string, code: string): Promise<void> {
    if (this.isDev) {
      this.logger.log(`[DEV] Verification code for ${to}: ${code}`);
    }

    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Verify your Koletex account',
      html: buildVerificationEmailHtml(code),
    });

    if (error) {
      this.logger.error(
        `Resend error (verification): ${JSON.stringify(error)}`,
      );
      if (this.isDev) {
        // In development, don't block registration if email fails.
        // The code is already logged above.
        return;
      }
      throw new InternalServerErrorException(
        'Failed to send verification email',
      );
    }
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    if (this.isDev) {
      this.logger.log(`[DEV] Password reset URL for ${to}: ${resetUrl}`);
    }

    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Reset your Koletex password',
      html: buildPasswordResetEmailHtml(resetUrl),
    });

    if (error) {
      this.logger.error(
        `Resend error (password reset): ${JSON.stringify(error)}`,
      );
      if (this.isDev) {
        return;
      }
      throw new InternalServerErrorException(
        'Failed to send password reset email',
      );
    }
  }
}
