import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

const wishlistWithProductInclude = {
  product: {
    select: {
      id: true,
      catalogReference: true,
      images: {
        where: { isMain: true },
        select: { urlImage: true },
      },
    },
  },
} satisfies Prisma.WishlistInclude;

const wishlistItemInclude = {
  product: {
    select: {
      id: true,
      catalogReference: true,
    },
  },
} satisfies Prisma.WishlistInclude;

export type WishlistWithProduct = Prisma.WishlistGetPayload<{
  include: typeof wishlistWithProductInclude;
}>;

export type WishlistItemWithProduct = Prisma.WishlistGetPayload<{
  include: typeof wishlistItemInclude;
}>;

@Injectable()
export class WishlistRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserAndProduct(userId: string, productId: string) {
    return this.prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
  }

  findAllByUser(userId: string): Promise<WishlistWithProduct[]> {
    return this.prisma.wishlist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: wishlistWithProductInclude,
    });
  }

  create(userId: string, productId: string): Promise<WishlistItemWithProduct> {
    return this.prisma.wishlist.create({
      data: { userId, productId },
      include: wishlistItemInclude,
    });
  }

  delete(userId: string, productId: string): Promise<void> {
    return this.prisma.wishlist
      .delete({ where: { userId_productId: { userId, productId } } })
      .then(() => undefined);
  }

  deleteAllByUser(userId: string): Promise<void> {
    return this.prisma.wishlist
      .deleteMany({ where: { userId } })
      .then(() => undefined);
  }

  createMany(userId: string, productIds: string[]): Promise<void> {
    return this.prisma.wishlist
      .createMany({
        data: productIds.map((productId) => ({ userId, productId })),
        skipDuplicates: true,
      })
      .then(() => undefined);
  }

  productExists(productId: string): Promise<boolean> {
    return this.prisma.product
      .findUnique({ where: { id: productId }, select: { id: true } })
      .then((p) => p !== null);
  }
}
