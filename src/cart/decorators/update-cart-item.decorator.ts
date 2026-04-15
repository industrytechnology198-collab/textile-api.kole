import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiUpdateCartItem() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update quantity of a cart item',
      description:
        '🔒 **Authenticated users only.**\n\n' +
        'Updates the quantity of a specific SKU already in the cart. ' +
        'Stock availability is re-validated against the new quantity.',
    }),
    ApiParam({ name: 'skuId', type: 'string', format: 'uuid', description: 'SKU ID of the cart item to update' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['quantity'],
        properties: {
          quantity: { type: 'integer', minimum: 1, example: 3 },
        },
      },
    }),
    ApiOkResponse({ description: 'Cart item updated. Returns the full updated cart.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
