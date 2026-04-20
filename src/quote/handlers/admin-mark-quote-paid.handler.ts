import { Injectable, NotFoundException } from '@nestjs/common';
import { QuoteRepository } from '../repositories/quote.repository';

@Injectable()
export class AdminMarkQuotePaidHandler {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  async execute(id: string) {
    const quote = await this.quoteRepository.findById(id);

    if (!quote) {
      throw new NotFoundException(`Quote request with id "${id}" not found`);
    }

    return this.quoteRepository.markAsPaid(id);
  }
}
