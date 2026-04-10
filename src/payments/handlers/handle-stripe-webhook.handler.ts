import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe = require('stripe');
import { OrderService } from 'src/order/order.service';
import { PaymentsRepository } from '../repositories/payments.repository';

@Injectable()
export class HandleStripeWebhookHandler {
  private readonly stripe: ReturnType<typeof Stripe>;
  private readonly logger = new Logger(HandleStripeWebhookHandler.name);

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly orderService: OrderService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') as string,
    );
  }

  async execute(
    rawBody: Buffer,
    signature: string,
  ): Promise<{ received: true }> {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    ) as string;

    let event: ReturnType<ReturnType<typeof Stripe>['webhooks']['constructEvent']>;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid signature';
      throw new BadRequestException(
        `Webhook signature verification failed: ${message}`,
      );
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as { metadata: Record<string, string> };
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        await this.paymentsRepository.markOrderAsPaid(orderId);

        try {
          await this.orderService.adminForwardToToptex(orderId);
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : 'Unknown Toptex error';
          this.logger.error(
            `Failed to forward order ${orderId} to Toptex after payment: ${message}`,
          );
        }
      }
    }

    return { received: true };
  }
}
