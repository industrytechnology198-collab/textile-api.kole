import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';

@Injectable()
export class RevenueHandler {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async execute() {
    const now = new Date();

    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Start of 12 weeks ago for the weekly chart
    const twelveWeeksAgo = new Date(now);
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 7 * 12);
    twelveWeeksAgo.setHours(0, 0, 0, 0);

    const [thisMonth, lastMonth, avgResult, recentPaid] = await Promise.all([
      this.analyticsRepository.sumPaidRevenue(thisMonthStart, nextMonthStart),
      this.analyticsRepository.sumPaidRevenue(lastMonthStart, thisMonthStart),
      this.analyticsRepository.avgQuoteValue(),
      this.analyticsRepository.findPaidQuotesSince(twelveWeeksAgo),
    ]);

    const thisMonthTotal = thisMonth.total;
    const lastMonthTotal = lastMonth.total;

    const trend =
      lastMonthTotal === 0
        ? null
        : Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100);

    // Group paid quotes by ISO week (YYYY-Www)
    const byWeek: Record<string, number> = {};
    for (const quote of recentPaid) {
      if (quote.paidAt) {
        const week = getIsoWeekLabel(quote.paidAt);
        byWeek[week] = (byWeek[week] ?? 0) + Number(quote.totalPrice);
      }
    }

    const weeklyRevenue = Object.entries(byWeek)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, total]) => ({ week, total: Math.round(total * 100) / 100 }));

    return {
      thisMonth: {
        total: thisMonthTotal,
        count: thisMonth.count,
      },
      lastMonth: {
        total: lastMonthTotal,
        count: lastMonth.count,
      },
      trendPercent: trend,
      averageQuoteValue: Math.round(Number(avgResult._avg?.totalPrice ?? 0) * 100) / 100,
      weeklyRevenue,
    };
  }
}

function getIsoWeekLabel(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNumber = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}
