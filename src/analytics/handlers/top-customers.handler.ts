import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';

@Injectable()
export class TopCustomersHandler {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async execute(limit = 10) {
    const topGroups = await this.analyticsRepository.findTopCustomers(limit);

    if (topGroups.length === 0) return { customers: [] };

    const userIds = topGroups.map((g) => g.userId);
    const users = await this.analyticsRepository.findUsersById(userIds);
    const userMap = new Map(users.map((u) => [u.id, u]));

    const lastQuoteDates = await Promise.all(
      userIds.map((id) => this.analyticsRepository.findLastQuoteDateByUserId(id)),
    );

    const customers = topGroups.map((group, index) => {
      const user = userMap.get(group.userId);
      return {
        userId: group.userId,
        firstName: user?.firstName ?? 'Unknown',
        lastName: user?.lastName ?? '',
        email: user?.email ?? '',
        totalPaid: Math.round(Number(group._sum?.totalPrice ?? 0) * 100) / 100,
        quoteCount: group._count?.userId ?? 0,
        lastQuoteAt: lastQuoteDates[index]?.createdAt ?? null,
      };
    });

    return { customers };
  }
}
