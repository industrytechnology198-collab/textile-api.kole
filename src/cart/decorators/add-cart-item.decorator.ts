import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiAddCartItem() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Add an item to the cart',
      description:
        '🔒 **Authenticated users only.**\n\n' +
        'Adds a SKU to the logged-in user\'s cart. ' +
        'If the item already exists in the cart, its quantity is incremented. ' +
        'Stock availability and SKU sale state are validated before adding.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['skuId', 'quantity'],
        properties: {
          skuId: { type: 'string', format: 'uuid', example: 'uuid-here' },
          quantity: { type: 'integer', minimum: 1, example: 2 },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Item added. Returns the full updated cart.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
    ApiForbiddenResponse({ description: 'Authenticated but not authorised.' }),
  );
}
