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

    this.logger.log(`⚡ Webhook received — event type: ${event.type} | event id: ${event.id}`);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as { id: string; amount: number; currency: string; metadata: Record<string, string> };
      const orderId = paymentIntent.metadata?.orderId;

      this.logger.log(
        `💳 payment_intent.succeeded — PI id: ${paymentIntent.id} | amount: ${paymentIntent.amount} ${paymentIntent.currency} | orderId in metadata: ${orderId ?? 'MISSING'}`,
      );

      if (!orderId) {
        this.logger.warn('⚠️  No orderId in PaymentIntent metadata — skipping order update');
      } else {
        this.logger.log(`📝 Marking order ${orderId} as paid...`);
        await this.paymentsRepository.markOrderAsPaid(orderId);
        this.logger.log(`✅ Order ${orderId} marked as isPaid: true`);

        this.logger.log(`📦 Forwarding order ${orderId} to Toptex (testMode: false)...`);
        try {
          await this.orderService.adminForwardToToptex(orderId, false);
          this.logger.log(`✅ Order ${orderId} successfully forwarded to Toptex`);
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : 'Unknown Toptex error';
          this.logger.error(
            `❌ Failed to forward order ${orderId} to Toptex after payment: ${message}`,
          );
        }
      }
    } else {
      this.logger.log(`ℹ️  Unhandled event type: ${event.type} — ignoring`);
    }

    return { received: true };
  }
}
