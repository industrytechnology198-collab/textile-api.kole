import { Injectable, NotFoundException } from '@nestjs/common';
import { QuoteRepository } from '../repositories/quote.repository';

@Injectable()
export class AdminUpdateQuoteNoteHandler {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  async execute(id: string, adminNote: string) {
    const existing = await this.quoteRepository.findById(id);

    if (!existing) {
      throw new NotFoundException('Quote request not found');
    }

    return this.quoteRepository.updateAdminNote(id, adminNote);
  }
}
