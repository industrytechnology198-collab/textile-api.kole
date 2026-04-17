import { Injectable, NotFoundException } from '@nestjs/common';
import { QuoteRepository } from '../repositories/quote.repository';

@Injectable()
export class GetMyQuoteByIdHandler {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  async execute(id: string, userId: string) {
    const quote = await this.quoteRepository.findByIdAndUserId(id, userId);

    if (!quote) {
      throw new NotFoundException('Quote request not found');
    }

    return quote;
  }
}
