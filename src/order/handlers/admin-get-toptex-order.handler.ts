import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { ToptexOrderService } from '../services/toptex-order.service';

@Injectable()
export class AdminGetToptexOrderHandler {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly toptexOrderService: ToptexOrderService,
  ) {}

  async execute(id: string) {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!order.toptexOrderId) {
      throw new BadRequestException(
        'This order has not been forwarded to Toptex yet',
      );
    }

    return this.toptexOrderService.getOrder(order.toptexOrderId);
  }
}
