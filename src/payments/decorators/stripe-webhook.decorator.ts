import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiHeader,
} from '@nestjs/swagger';

export function ApiStripeWebhook() {
  return applyDecorators(
    ApiOperation({
      summary: 'Stripe webhook endpoint',
      description:
        'Receives Stripe webhook events. Verifies the `stripe-signature` header and processes `payment_intent.succeeded` to mark the order as paid and forward it to Toptex. **Do not call this endpoint manually** — it is intended for Stripe only.',
    }),
    ApiHeader({
      name: 'stripe-signature',
      description: 'Stripe webhook signature (set automatically by Stripe)',
      required: true,
    }),
    ApiOkResponse({
      description: 'Webhook received and processed',
      schema: {
        type: 'object',
        properties: {
          received: { type: 'boolean', example: true },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid Stripe signature or malformed payload',
    }),
  );
}
