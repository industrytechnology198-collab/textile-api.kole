import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiAdminForwardOrder() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Manually forward an order to Toptex',
      description:
        '🔒 **Admin only.**\n\n' +
        'Forwards an existing order to the Toptex API.\n\n' +
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
        'Will fail if the order has already been forwarded to Toptex.',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      format: 'uuid',
      description: 'The internal order ID to forward.',
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
    ApiOkResponse({ description: 'Order forwarded to Toptex successfully.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
    ApiBadRequestResponse({
      description: 'Order already forwarded / no delivery address.',
    }),
    ApiNotFoundResponse({ description: 'Order or user not found.' }),
  );
}
