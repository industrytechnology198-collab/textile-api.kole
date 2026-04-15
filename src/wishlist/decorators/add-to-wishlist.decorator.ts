import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiAddToWishlist() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Add a product to the wishlist',
      description:
        '🔒 **Authenticated users only.**\n\n' +
        'Adds a product to the current user\'s wishlist. ' +
        'Each product can only appear **once** per user.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['productId'],
        properties: {
          productId: { type: 'string', format: 'uuid', example: 'uuid-here' },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Product added to wishlist.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
    ApiNotFoundResponse({ description: 'Product not found.' }),
    ApiConflictResponse({ description: 'Product already in wishlist.' }),
  );
}
