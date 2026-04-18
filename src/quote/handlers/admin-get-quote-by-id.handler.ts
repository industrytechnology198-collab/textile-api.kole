import { Injectable, NotFoundException } from '@nestjs/common';
import { QuoteRepository } from '../repositories/quote.repository';

@Injectable()
export class AdminGetQuoteByIdHandler {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  async execute(id: string) {
    const quote = await this.quoteRepository.findById(id);

    if (!quote) {
      throw new NotFoundException('Quote request not found');
    }

    return quote;
  }
}
