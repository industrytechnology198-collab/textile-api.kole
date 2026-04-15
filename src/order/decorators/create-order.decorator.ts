import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiCreateOrder() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Place an order from the cart',
      description:
        '🔒 **Authenticated users only.**\n\n' +
        'Creates a new order from the current user\'s cart and forwards it to Toptex.\n\n' +
        '---\n\n' +
        '### ⚠️ Required body field: `testMode`\n\n' +
        'You **must** send `testMode` in the request body:\n\n' +
        '| Value | Effect |\n' +
        '|-------|--------|\n' +
        '| `true` | Sends a **TEST** order to Toptex — no real fulfillment, safe for development |\n' +
        '| `false` | Sends a **REAL** order to Toptex — triggers actual production fulfillment |\n\n' +
        '**Example body:**\n' +
        '```json\n{ "testMode": false }\n```\n\n' +
        '---\n\n' +
        'Also requires: a default delivery address and at least one item in the cart.',
    }),
    ApiBody({
      description:
        '**testMode** (required) — `true` = test order (safe), `false` = real order (production)',
      required: true,
      schema: {
        type: 'object',
        required: ['testMode'],
        properties: {
          testMode: {
            type: 'boolean',
            example: false,
            description:
              '⚠️ REQUIRED. true = test order sent to Toptex (no real fulfillment). false = real production order.',
          },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Order created and forwarded to Toptex.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
    ApiBadRequestResponse({
      description:
        'Cart is empty / item unavailable / out of stock / no delivery address.',
    }),
  );
}
