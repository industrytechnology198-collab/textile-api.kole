import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuoteStatus } from '@prisma/client';

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Action Queue ─────────────────────────────────────────────────

  countPendingQuotes() {
    return this.prisma.quoteRequest.count({
      where: { status: QuoteStatus.PENDING },
    });
  }

  findConfirmedUnpaid() {
    return this.prisma.quoteRequest.findMany({
      where: { status: QuoteStatus.CONFIRMED, isPaid: false },
      select: {
        id: true,
        totalPrice: true,
        createdAt: true,
        confirmedAt: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { confirmedAt: 'asc' },
    });
  }

  findPaidButNotAdvanced() {
    return this.prisma.quoteRequest.findMany({
      where: { isPaid: true, status: QuoteStatus.CONFIRMED },
      select: {
        id: true,
        totalPrice: true,
        paidAt: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { paidAt: 'asc' },
    });
  }

  findStuckProcessing(olderThanDays: number) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - olderThanDays);

    return this.prisma.quoteRequest.findMany({
      where: { status: QuoteStatus.PROCESSING, updatedAt: { lt: cutoff } },
      select: {
        id: true,
        totalPrice: true,
        updatedAt: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { updatedAt: 'asc' },
    });
  }

  // ─── Revenue ──────────────────────────────────────────────────────

  async sumPaidRevenue(from: Date, to: Date): Promise<{ total: number; count: number }> {
    const [agg, count] = await Promise.all([
      this.prisma.quoteRequest.aggregate({
        where: { isPaid: true, paidAt: { gte: from, lt: to } },
        _sum: { totalPrice: true },
      }),
      this.prisma.quoteRequest.count({
        where: { isPaid: true, paidAt: { gte: from, lt: to } },
      }),
    ]);
    return { total: Number(agg._sum?.totalPrice ?? 0), count };
  }

  avgQuoteValue() {
    return this.prisma.quoteRequest.aggregate({
      where: { isPaid: true },
      _avg: { totalPrice: true },
    });
  }

  async findPaidQuotesSince(since: Date): Promise<{ paidAt: Date | null; totalPrice: import('@prisma/client').Prisma.Decimal }[]> {
    return this.prisma.quoteRequest.findMany({
      where: { isPaid: true, paidAt: { gte: since } },
      select: { paidAt: true, totalPrice: true },
      orderBy: { paidAt: 'asc' },
    }) as any;
  }

  // ─── Quote Funnel ─────────────────────────────────────────────────

  countByStatus() {
    return this.prisma.quoteRequest.groupBy({
      by: ['status'],
      _count: { id: true },
    });
  }

  countConfirmedUnpaid() {
    return this.prisma.quoteRequest.count({
      where: { status: QuoteStatus.CONFIRMED, isPaid: false },
    });
  }

  countPaidTotal() {
    return this.prisma.quoteRequest.count({
      where: { isPaid: true },
    });
  }

  // ─── Top Customers ────────────────────────────────────────────────

  findTopCustomers(limit: number) {
    return this.prisma.quoteRequest.groupBy({
      by: ['userId'],
      where: { isPaid: true },
      _sum: { totalPrice: true },
      _count: { userId: true },
      orderBy: { _sum: { totalPrice: 'desc' } },
      take: limit,
    });
  }

  findUsersById(userIds: string[]) {
    return this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
  }

  findLastQuoteDateByUserId(userId: string) {
    return this.prisma.quoteRequest.findFirst({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
