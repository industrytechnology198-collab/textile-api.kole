import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiGetCart() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: "Get the current user's cart",
      description:
        '🔒 **Authenticated users only.**\n\n' +
        'Returns the full cart for the logged-in user, including all items, ' +
        'SKU details, product images, and per-item pricing.',
    }),
    ApiOkResponse({ description: 'Returns the full cart with all items and totals.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
