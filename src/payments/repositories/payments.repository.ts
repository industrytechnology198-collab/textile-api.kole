import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrderByIdAndUserId(orderId: string, userId: string) {
    return this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
  }

  async markOrderAsPaid(orderId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { isPaid: true, status: OrderStatus.PROCESSING },
    });
  }
}
