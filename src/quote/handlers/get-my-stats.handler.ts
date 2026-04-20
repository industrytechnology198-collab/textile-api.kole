import { Injectable } from '@nestjs/common';
import { QuoteRepository } from '../repositories/quote.repository';

@Injectable()
export class GetMyStatsHandler {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  execute(userId: string) {
    return this.quoteRepository.getMyStats(userId);
  }
}
