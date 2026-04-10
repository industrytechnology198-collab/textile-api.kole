import { Injectable } from '@nestjs/common';
import { GetOrdersQueryDto } from '../dto/order-query.dto';
import { OrderRepository } from '../repositories/order.repository';
import { mapOrder } from '../types/order-response.types';

@Injectable()
export class GetOrdersHandler {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(userId: string, query: GetOrdersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const { orders, total } = await this.orderRepository.findByUserIdPaginated(
      userId,
      page,
      limit,
    );

    return {
      data: orders.map((order) => mapOrder(order)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
