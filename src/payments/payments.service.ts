import { Injectable } from '@nestjs/common';
import { CreatePaymentIntentHandler } from './handlers/create-payment-intent.handler';
import { HandleStripeWebhookHandler } from './handlers/handle-stripe-webhook.handler';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly createPaymentIntentHandler: CreatePaymentIntentHandler,
    private readonly handleStripeWebhookHandler: HandleStripeWebhookHandler,
  ) {}

  createPaymentIntent(dto: CreatePaymentIntentDto, userId: string) {
    return this.createPaymentIntentHandler.execute(dto, userId);
  }

  handleWebhook(rawBody: Buffer, signature: string) {
    return this.handleStripeWebhookHandler.execute(rawBody, signature);
  }
}
