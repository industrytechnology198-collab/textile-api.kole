import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { QuoteStatus } from '@prisma/client';

const STATUS_ORDER: QuoteStatus[] = [
  QuoteStatus.PENDING,
  QuoteStatus.CONFIRMED,
  QuoteStatus.PROCESSING,
  QuoteStatus.SHIPPED,
  QuoteStatus.DELIVERED,
  QuoteStatus.CANCELLED,
];

@Injectable()
export class QuoteFunnelHandler {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async execute() {
    const [groupedByStatus, confirmedUnpaidCount, paidTotal] = await Promise.all([
      this.analyticsRepository.countByStatus(),
      this.analyticsRepository.countConfirmedUnpaid(),
      this.analyticsRepository.countPaidTotal(),
    ]);

    const countMap: Record<string, number> = {};
    for (const row of groupedByStatus) {
      countMap[row.status] = row._count.id;
    }

    const funnel = STATUS_ORDER.map((status) => ({
      status,
      count: countMap[status] ?? 0,
    }));

    return {
      funnel,
      highlights: {
        confirmedUnpaid: confirmedUnpaidCount,
        totalPaid: paidTotal,
      },
    };
  }
}
