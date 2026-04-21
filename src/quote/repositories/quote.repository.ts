import { Injectable } from '@nestjs/common';
import { Prisma, QuoteStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

const quoteItemsInclude = Prisma.validator<Prisma.QuoteRequestItemInclude>()({
  sku: {
    include: {
      color: {
        include: {
          product: {
            select: {
              id: true,
              catalogReference: true,
              brand: true,
            },
          },
        },
      },
    },
  },
});

const quoteInclude = Prisma.validator<Prisma.QuoteRequestInclude>()({
  address: true,
  items: {
    include: quoteItemsInclude,
  },
});

const adminQuoteInclude = Prisma.validator<Prisma.QuoteRequestInclude>()({
  user: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      preferredLanguage: true,
    },
  },
  address: true,
  items: {
    include: quoteItemsInclude,
  },
});

@Injectable()
export class QuoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  findSkuById(skuId: string) {
    return this.prisma.productSku.findUnique({
      where: { id: skuId },
      select: { id: true, price: true, publicPrice: true, saleState: true, isDiscontinued: true },
    });
  }

  async findUserLanguage(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { preferredLanguage: true },
    });
    return user?.preferredLanguage ?? 'nl';
  }

  findAddressByIdAndUserId(addressId: string, userId: string) {
    return this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });
  }

  createQuote(data: {
    userId: string;
    addressId: string;
    totalPrice: number;
    note?: string;
    items: Array<{ skuId: string; quantity: number; unitPrice: number }>;
  }) {
    return this.prisma.quoteRequest.create({
      data: {
        userId: data.userId,
        addressId: data.addressId,
        totalPrice: data.totalPrice,
        note: data.note,
        items: {
          create: data.items.map((item) => ({
            skuId: item.skuId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: quoteInclude,
    });
  }

  findAllByUserId(
    userId: string,
    filters: { status?: QuoteStatus; skip: number; take: number },
  ) {
    return this.prisma.quoteRequest.findMany({
      where: { userId, ...(filters.status && { status: filters.status }) },
      include: quoteInclude,
      orderBy: { createdAt: 'desc' },
      skip: filters.skip,
      take: filters.take,
    });
  }

  countByUserId(userId: string, status?: QuoteStatus) {
    return this.prisma.quoteRequest.count({
      where: { userId, ...(status && { status }) },
    });
  }

  findByIdAndUserId(id: string, userId: string) {
    return this.prisma.quoteRequest.findFirst({
      where: { id, userId },
      include: quoteInclude,
    });
  }

  findById(id: string) {
    return this.prisma.quoteRequest.findUnique({
      where: { id },
      include: adminQuoteInclude,
    });
  }

  findAll(filters: { status?: QuoteStatus; skip: number; take: number }) {
    return this.prisma.quoteRequest.findMany({
      where: { ...(filters.status && { status: filters.status }) },
      include: adminQuoteInclude,
      orderBy: { createdAt: 'desc' },
      skip: filters.skip,
      take: filters.take,
    });
  }

  countAll(status?: QuoteStatus) {
    return this.prisma.quoteRequest.count({
      where: { ...(status && { status }) },
    });
  }

  updateStatus(id: string, status: QuoteStatus) {
    return this.prisma.quoteRequest.update({
      where: { id },
      data: {
        status,
        ...(status === QuoteStatus.CONFIRMED && { confirmedAt: new Date() }),
      },
      include: adminQuoteInclude,
    });
  }

  updateAdminNote(id: string, adminNote: string) {
    return this.prisma.quoteRequest.update({
      where: { id },
      data: { adminNote },
      include: adminQuoteInclude,
    });
  }

  async getMyStats(userId: string) {
    const [grouped, paidAggregate] = await Promise.all([
      this.prisma.quoteRequest.groupBy({
        by: ['status'],
        where: { userId },
        _count: { status: true },
      }),
      this.prisma.quoteRequest.aggregate({
        where: { userId, isPaid: true },
        _sum: { totalPrice: true },
        _count: { _all: true },
      }),
    ]);

    const countMap: Record<string, number> = {};
    for (const row of grouped) {
      countMap[row.status] = row._count.status;
    }

    const totalQuotes = Object.values(countMap).reduce((a, b) => a + b, 0);
    const pendingCount = (countMap['PENDING'] ?? 0) + (countMap['CONFIRMED'] ?? 0);
    const deliveredCount = countMap['DELIVERED'] ?? 0;
    const totalSpent = Math.round(Number(paidAggregate._sum?.totalPrice ?? 0) * 100) / 100;

    return { totalQuotes, pendingCount, deliveredCount, totalSpent };
  }

  markAsPaid(id: string) {
    return this.prisma.quoteRequest.update({
      where: { id },
      data: { isPaid: true, paidAt: new Date() },
      include: adminQuoteInclude,
    });
  }
}
