import { Injectable } from '@nestjs/common';
import { QuoteRepository } from '../repositories/quote.repository';
import { AdminGetQuotesQueryDto } from '../dto/get-quotes-query.dto';

@Injectable()
export class AdminGetAllQuotesHandler {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  async execute(query: AdminGetQuotesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.quoteRepository.findAll({ status: query.status, skip, take: limit }),
      this.quoteRepository.countAll(query.status),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
