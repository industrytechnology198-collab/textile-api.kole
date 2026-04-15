import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiClearWishlist() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Clear the entire wishlist',
      description:
        '🔒 **Authenticated users only.**\n\n' +
        'Removes all products from the current user\'s wishlist.',
    }),
    ApiOkResponse({ description: 'Wishlist cleared.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
