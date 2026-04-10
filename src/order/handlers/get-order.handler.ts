import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { mapOrder } from '../types/order-response.types';

@Injectable()
export class GetOrderHandler {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string, userId: string, isAdmin: boolean) {
    const order = await this.orderRepository.findByIdWithItems(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!isAdmin && order.userId !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return mapOrder(order);
  }
}
