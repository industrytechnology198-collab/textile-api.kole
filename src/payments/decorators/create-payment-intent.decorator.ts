import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export function ApiCreatePaymentIntent() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a Stripe PaymentIntent for an order',
      description:
        'Creates a Stripe PaymentIntent for the given order. The order must belong to the authenticated user and must not already be paid. Returns a `clientSecret` to be used on the frontend to confirm the payment with Stripe.js.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['orderId'],
        properties: {
          orderId: {
            type: 'string',
            format: 'uuid',
            example: '3f615bd3-f68b-4ff7-86d9-3560f0a613a7',
            description: 'UUID of the order to pay for',
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'PaymentIntent created successfully',
      schema: {
        type: 'object',
        properties: {
          clientSecret: {
            type: 'string',
            example: 'pi_3PxxxxxxxxxxxxxxxxxxxxXx_secret_xxxxxxxxxxxxxxxxxxxxxx',
            description:
              'Stripe client secret — pass this to stripe.confirmCardPayment() on the frontend',
          },
        },
      },
    }),
    ApiNotFoundResponse({ description: 'Order not found' }),
    ApiBadRequestResponse({ description: 'Order is already paid' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' }),
  );
}
