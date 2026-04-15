import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { StockService } from 'src/stock/stock.service';
import { OrderRepository } from '../repositories/order.repository';
import { ToptexOrderService } from '../services/toptex-order.service';
import { mapOrder } from '../types/order-response.types';
import { buildToptexPayloadFromCart } from '../services/toptex-payload.builder';

@Injectable()
export class CreateOrderHandler {
  private readonly logger = new Logger(CreateOrderHandler.name);

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly stockService: StockService,
    private readonly toptexOrderService: ToptexOrderService,
  ) {}

  async execute(userId: string, testMode: boolean) {
    const cart = await this.orderRepository.findCartByUserIdWithItems(userId);

    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    for (const item of cart.cartItems) {
      const sku = item.sku;
      if (!sku || sku.saleState !== 'active' || sku.isDiscontinued) {
        throw new BadRequestException(
          'One or more items in your cart are no longer available',
        );
      }

      const inStock = await this.stockService.checkStockAvailability(
        item.skuId,
        item.quantity,
      );

      if (!inStock) {
        throw new BadRequestException('One or more items are out of stock');
      }
    }

    const address = await this.orderRepository.findDefaultAddressByUserId(userId);
    if (!address) {
      throw new BadRequestException(
        'Please add a delivery address before placing an order',
      );
    }

    const user = await this.orderRepository.findUserToptexInfoById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const totalPrice = cart.cartItems.reduce(
      (acc, item) => acc + Number(item.sku.price) * item.quantity,
      0,
    );

    const myOrderId = this.generateOrderReference();

    const createdOrder = await this.orderRepository.createOrderWithItems({
      userId,
      totalPrice,
      isPaid: false,
      myOrderId,
      items: cart.cartItems.map((item) => ({
        skuId: item.skuId,
        quantity: item.quantity,
        price: Number(item.sku.price),
      })),
    });

    try {
      const payload = buildToptexPayloadFromCart(myOrderId, cart, address, user, testMode);
      this.logger.log(
        `Sending to Toptex — country: "${payload.deliveryAddress.country}", payload: ${JSON.stringify(payload)}`,
      );
      const response = await this.toptexOrderService.createOrder(payload);

      this.logger.log(
        `Toptex response: ${JSON.stringify(response)}`,
      );

      // Toptex returns HTTP 200 even on errors — check for errorType
      if ((response as any).errorType) {
        throw new Error(
          (response as any).errorMessage || 'Toptex rejected the order',
        );
      }

      if (!response.temporaryOrderId) {
        throw new Error('Toptex response missing temporaryOrderId');
      }

      await this.orderRepository.updateOrder(createdOrder.id, {
        toptexOrderId: response.temporaryOrderId,
        status: OrderStatus.PROCESSING,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown Toptex forwarding error';
      this.logger.error(
        `Failed to forward order ${createdOrder.id} to Toptex: ${message}`,
      );
    }

    await this.orderRepository.clearCartItemsByCartId(cart.id);

    const finalOrder = await this.orderRepository.findByIdWithItems(createdOrder.id);
    if (!finalOrder) {
      throw new NotFoundException('Order not found');
    }

    return mapOrder(finalOrder);
  }

  private generateOrderReference(): string {
    const timestamp = Date.now();
    const randomDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    return `ORD-${timestamp}-${randomDigits}`;
  }
}
