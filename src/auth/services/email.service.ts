import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import {
  buildVerificationEmailHtml,
  getVerificationEmailSubject,
} from '../templates/verification-email.template';
import {
  buildPasswordResetEmailHtml,
  getPasswordResetEmailSubject,
} from '../templates/password-reset-email.template';
import {
  buildQuoteConfirmationUserHtml,
  getQuoteConfirmationSubject,
} from '../templates/quote-confirmation-user.template';
import { buildQuoteNotificationAdminHtml } from '../templates/quote-notification-admin.template';
import {
  buildQuoteStatusUpdateHtml,
  getQuoteStatusUpdateSubject,
} from '../templates/quote-status-update.template';

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
      // 'onboarding@resend.dev',
      'contact@kole.be',
    );
    this.isDev = this.configService.get<string>('NODE_ENV') !== 'production';
  }

  async sendVerificationEmail(to: string, code: string, lang = 'nl'): Promise<void> {
    if (this.isDev) {
      this.logger.log(`[DEV] Verification code for ${to}: ${code}`);
    }

    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject: getVerificationEmailSubject(lang),
      html: buildVerificationEmailHtml(code, lang),
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

  async sendPasswordResetEmail(to: string, token: string, lang = 'nl'): Promise<void> {
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
      subject: getPasswordResetEmailSubject(lang),
      html: buildPasswordResetEmailHtml(resetUrl, lang),
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

  async sendQuoteConfirmationToUser(to: string, quote: any, lang = 'nl'): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject: getQuoteConfirmationSubject(lang),
      html: buildQuoteConfirmationUserHtml(quote, lang),
    });

    if (error) {
      this.logger.error(`Resend error (quote confirmation user): ${JSON.stringify(error)}`);
    }
  }

  async sendQuoteStatusUpdateToUser(
    to: string,
    quoteId: string,
    status: string,
    lang: string = 'nl',
  ): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject: getQuoteStatusUpdateSubject(lang),
      html: buildQuoteStatusUpdateHtml(quoteId, status, lang),
    });

    if (error) {
      this.logger.error(`Resend error (quote status update): ${JSON.stringify(error)}`);
    }
  }

  async sendQuoteNotificationToAdmin(quote: any): Promise<void> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL', this.from);

    const { error } = await this.resend.emails.send({
      from: this.from,
      to: adminEmail,
      subject: `🛎️ New Quote Request — ${quote.id}`,
      html: buildQuoteNotificationAdminHtml(quote),
    });

    if (error) {
      this.logger.error(`Resend error (quote notification admin): ${JSON.stringify(error)}`);
    }
  }
}
