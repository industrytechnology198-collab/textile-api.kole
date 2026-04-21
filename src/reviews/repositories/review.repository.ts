import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

const reviewInclude = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  product: {
    select: {
      id: true,
      catalogReference: true,
    },
  },
} satisfies Prisma.ReviewInclude;

export type ReviewWithIncludes = Prisma.ReviewGetPayload<{
  include: typeof reviewInclude;
}>;

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.review.findUnique({
      where: { id },
      include: reviewInclude,
    });
  }

  findByUserAndProduct(userId: string, productId: string) {
    return this.prisma.review.findFirst({
      where: { userId, productId },
      include: reviewInclude,
    });
  }

  findAllByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId, isVisible: true },
      orderBy: { createdAt: 'desc' },
      include: reviewInclude,
    });
  }

  findAll() {
    return this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: reviewInclude,
    });
  }

  create(data: {
    userId: string;
    productId: string;
    rating: number;
    comment?: string;
  }) {
    return this.prisma.review.create({
      data,
      include: reviewInclude,
    });
  }

  update(
    id: string,
    data: { rating?: number; comment?: string },
  ) {
    return this.prisma.review.update({
      where: { id },
      data,
      include: reviewInclude,
    });
  }

  delete(id: string): Promise<void> {
    return this.prisma.review.delete({ where: { id } }).then(() => undefined);
  }

  setVisibility(id: string, isVisible: boolean) {
    return this.prisma.review.update({
      where: { id },
      data: { isVisible },
      include: reviewInclude,
    });
  }

  productExists(productId: string): Promise<boolean> {
    return this.prisma.product
      .findUnique({ where: { id: productId }, select: { id: true } })
      .then((p) => p !== null);
  }
}
