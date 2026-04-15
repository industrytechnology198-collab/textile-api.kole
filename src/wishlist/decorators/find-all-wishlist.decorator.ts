import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiFindAllWishlist() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all wishlist items',
      description:
        '🔒 **Authenticated users only.**\n\n' +
        'Returns all products in the current user\'s wishlist, ordered by most recently added.',
    }),
    ApiOkResponse({ description: 'Wishlist retrieved successfully.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
