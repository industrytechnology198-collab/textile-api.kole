import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrderRepository } from '../repositories/order.repository';
import { ToptexOrderService } from '../services/toptex-order.service';
import { buildToptexPayloadFromOrder } from '../services/toptex-payload.builder';
import { mapOrder } from '../types/order-response.types';

@Injectable()
export class AdminForwardOrderHandler {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly toptexOrderService: ToptexOrderService,
  ) {}

  async execute(id: string, testMode: boolean) {
    const order = await this.orderRepository.findByIdWithItems(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.toptexOrderId) {
      throw new BadRequestException('Order already forwarded to Toptex');
    }

    const address = await this.orderRepository.findDefaultAddressByUserId(order.userId);
    if (!address) {
      throw new BadRequestException(
        'Please add a delivery address before placing an order',
      );
    }

    const user = await this.orderRepository.findUserToptexInfoById(order.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payload = buildToptexPayloadFromOrder(order, address, user, testMode);
    const response = await this.toptexOrderService.createOrder(payload);

    const updatedOrder = await this.orderRepository.updateOrder(id, {
      toptexOrderId: response.temporaryOrderId,
      status: OrderStatus.PROCESSING,
    });

    return mapOrder(updatedOrder);
  }
}
