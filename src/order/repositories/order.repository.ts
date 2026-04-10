import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

const orderItemsInclude = Prisma.validator<Prisma.OrderItemInclude>()({
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

const orderInclude = Prisma.validator<Prisma.OrderInclude>()({
  orderItems: {
    include: orderItemsInclude,
  },
});

const adminOrderInclude = Prisma.validator<Prisma.OrderInclude>()({
  user: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  },
  orderItems: {
    include: orderItemsInclude,
  },
});

const cartInclude = Prisma.validator<Prisma.CartInclude>()({
  cartItems: {
    include: {
      sku: {
        include: {
          color: {
            include: {
              product: {
                select: {
                  id: true,
                  saleState: true,
                },
              },
            },
          },
        },
      },
    },
  },
});

const userToptexSelection = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
});

export type OrderWithItems = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;
export type AdminOrderWithItems = Prisma.OrderGetPayload<{
  include: typeof adminOrderInclude;
}>;
export type CartWithSku = Prisma.CartGetPayload<{ include: typeof cartInclude }>;
export type UserToptexInfo = Prisma.UserGetPayload<{ select: typeof userToptexSelection }>;

export interface CreateOrderInput {
  userId: string;
  totalPrice: number;
  isPaid: boolean;
  myOrderId: string;
  items: Array<{
    skuId: string;
    quantity: number;
    price: number;
  }>;
}

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCartByUserIdWithItems(userId: string): Promise<CartWithSku | null> {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
  }

  async clearCartItemsByCartId(cartId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({ where: { cartId } });
  }

  async findDefaultAddressByUserId(userId: string) {
    return this.prisma.address.findFirst({
      where: { userId, isDefault: true },
    });
  }

  async findUserToptexInfoById(userId: string): Promise<UserToptexInfo | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: userToptexSelection,
    });
  }

  async createOrderWithItems(input: CreateOrderInput): Promise<OrderWithItems> {
    return this.prisma.order.create({
      data: {
        user: { connect: { id: input.userId } },
        status: OrderStatus.PENDING,
        totalPrice: input.totalPrice,
        isPaid: input.isPaid,
        myOrderId: input.myOrderId,
        toptexOrderId: null,
        orderItems: {
          create: input.items.map((item) => ({
            skuId: item.skuId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: orderInclude,
    });
  }

  async findById(id: string) {
    return this.prisma.order.findUnique({ where: { id } });
  }

  async findByIdWithItems(id: string): Promise<OrderWithItems | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });
  }

  async findByUserIdPaginated(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        include: orderInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      orders,
      total,
    };
  }

  async findAllPaginated(
    page: number,
    limit: number,
    status?: OrderStatus,
    userId?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};
    if (status) {
      where.status = status;
    }
    if (userId) {
      where.userId = userId;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: adminOrderInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      total,
    };
  }

  async updateOrder(
    id: string,
    data: Prisma.OrderUpdateInput,
  ): Promise<OrderWithItems> {
    return this.prisma.order.update({
      where: { id },
      data,
      include: orderInclude,
    });
  }
}
