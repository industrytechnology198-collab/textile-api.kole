import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsRepository } from '../repositories/payments.repository';
import { CreatePaymentIntentDto } from '../dto/create-payment-intent.dto';
import Stripe = require('stripe');

@Injectable()
export class CreatePaymentIntentHandler {
  private readonly stripe: ReturnType<typeof Stripe>;

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly configService: ConfigService,
  ) {
    this.stripe = Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') as string,
    );
  }

  async execute(
    dto: CreatePaymentIntentDto,
    userId: string,
  ): Promise<{ clientSecret: string }> {
    const order = await this.paymentsRepository.findOrderByIdAndUserId(
      dto.orderId,
      userId,
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.isPaid) {
      throw new BadRequestException('Order is already paid');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: { orderId: order.id, userId },
    });

    if (!paymentIntent.client_secret) {
      throw new BadRequestException('Failed to create payment intent');
    }

    return { clientSecret: paymentIntent.client_secret };
  }
}
