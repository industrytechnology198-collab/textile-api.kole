import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrderRepository } from '../repositories/order.repository';

@Injectable()
export class CancelOrderHandler {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string, userId: string): Promise<{ message: string }> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('This order cannot be cancelled');
    }

    await this.orderRepository.updateOrder(id, { status: OrderStatus.CANCELLED });

    return { message: 'Order cancelled successfully' };
  }
}
