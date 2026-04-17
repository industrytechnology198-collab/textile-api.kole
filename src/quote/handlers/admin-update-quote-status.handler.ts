import { Injectable, NotFoundException } from '@nestjs/common';
import { QuoteStatus } from '@prisma/client';
import { QuoteRepository } from '../repositories/quote.repository';
import { EmailService } from 'src/auth/services/email.service';

@Injectable()
export class AdminUpdateQuoteStatusHandler {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(id: string, status: QuoteStatus) {
    const existing = await this.quoteRepository.findById(id);

    if (!existing) {
      throw new NotFoundException('Quote request not found');
    }

    const updated = await this.quoteRepository.updateStatus(id, status);

    // Notify the user who placed the order — fire-and-forget
    const user = existing.user as { email: string; preferredLanguage?: string } | null;
    if (user?.email) {
      this.emailService
        .sendQuoteStatusUpdateToUser(
          user.email,
          id,
          status,
          user.preferredLanguage ?? 'nl',
        )
        .catch(() => null);
    }

    return updated;
  }
}
