import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiClearCart() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Clear all items from the cart',
      description:
        '🔒 **Authenticated users only.**\n\n' +
        'Removes every item from the logged-in user\'s cart in one operation.',
    }),
    ApiOkResponse({ description: 'Cart cleared successfully.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
