import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiRemoveFromWishlist() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Remove a product from the wishlist',
      description:
        '🔒 **Authenticated users only.**\n\n' +
        'Removes a specific product from the current user\'s wishlist.',
    }),
    ApiOkResponse({ description: 'Product removed from wishlist.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
    ApiNotFoundResponse({ description: 'Product not found in wishlist.' }),
  );
}
