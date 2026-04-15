import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiRemoveCartItem() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Remove an item from the cart',
      description:
        '🔒 **Authenticated users only.**\n\n' +
        'Removes a specific SKU from the logged-in user\'s cart entirely, regardless of quantity.',
    }),
    ApiParam({ name: 'skuId', type: 'string', format: 'uuid', description: 'SKU ID of the item to remove' }),
    ApiOkResponse({ description: 'Item removed. Returns the full updated cart.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
