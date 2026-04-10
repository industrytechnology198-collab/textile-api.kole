import { Injectable } from '@nestjs/common';
import { GetAdminOrdersQueryDto } from '../dto/order-query.dto';
import { OrderRepository } from '../repositories/order.repository';
import { mapAdminOrder } from '../types/order-response.types';

@Injectable()
export class AdminGetAllOrdersHandler {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(query: GetAdminOrdersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const { orders, total } = await this.orderRepository.findAllPaginated(
      page,
      limit,
      query.status,
      query.userId,
    );

    return {
      data: orders.map((order) => mapAdminOrder(order)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
