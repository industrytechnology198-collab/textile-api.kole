import { Injectable } from '@nestjs/common';
import { QuoteRepository } from '../repositories/quote.repository';
import { GetMyQuotesQueryDto } from '../dto/get-quotes-query.dto';

@Injectable()
export class GetMyQuotesHandler {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  async execute(userId: string, query: GetMyQuotesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.quoteRepository.findAllByUserId(userId, {
        status: query.status,
        skip,
        take: limit,
      }),
      this.quoteRepository.countByUserId(userId, query.status),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
