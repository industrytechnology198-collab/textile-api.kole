import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

const cartItemWithSku = {
  include: {
    sku: {
      select: {
        id: true,
        sizeLabel: true,
        price: true,
        publicPrice: true,
        saleState: true,
        isDiscontinued: true,
        color: {
          select: {
            colorCode: true,
            hexColor: true,
            packshots: {
              where: { angleName: 'FACE' },
              select: { urlImage: true },
              take: 1,
            },
            product: {
              select: {
                id: true,
                catalogReference: true,
                brand: true,
                images: {
                  where: { isMain: true },
                  select: { urlImage: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    },
  },
};

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCartByUserId(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: cartItemWithSku,
      },
    });
  }

  async findOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: cartItemWithSku,
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          cartItems: cartItemWithSku,
        },
      });
    }

    return cart;
  }

  async findCartItemBySkuId(cartId: string, skuId: string) {
    return this.prisma.cartItem.findFirst({
      where: { cartId, skuId },
    });
  }

  async createCartItem(cartId: string, skuId: string, quantity: number) {
    return this.prisma.cartItem.create({
      data: { cartId, skuId, quantity },
    });
  }

  async updateCartItemQuantity(cartItemId: string, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  async deleteCartItem(cartItemId: string) {
    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async clearCartItems(cartId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  async getCartWithItems(cartId: string) {
    return this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        cartItems: cartItemWithSku,
      },
    });
  }

  async findSkuById(skuId: string) {
    return this.prisma.productSku.findUnique({
      where: { id: skuId },
      select: {
        id: true,
        saleState: true,
        isDiscontinued: true,
      },
    });
  }

  async findAllCarts(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [carts, total] = await Promise.all([
      this.prisma.cart.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          cartItems: {
            include: {
              sku: {
                select: {
                  price: true,
                },
              },
            },
          },
        },
        orderBy: { id: 'asc' },
      }),
      this.prisma.cart.count(),
    ]);

    return { carts, total };
  }
}
