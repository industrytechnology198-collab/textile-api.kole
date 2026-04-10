import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrderRepository } from '../repositories/order.repository';
import { mapOrder } from '../types/order-response.types';

@Injectable()
export class AdminUpdateOrderStatusHandler {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string, status: OrderStatus) {
    const existing = await this.orderRepository.findById(id);

    if (!existing) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.orderRepository.updateOrder(id, { status });
    return mapOrder(updatedOrder);
  }
}
