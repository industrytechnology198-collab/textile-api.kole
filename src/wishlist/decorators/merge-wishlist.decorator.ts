import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiMergeWishlist() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Merge local wishlist into server wishlist',
      description:
        '🔒 **Authenticated users only.**\n\n' +
        'Merges an array of product IDs into the current user\'s wishlist. ' +
        'Duplicates are silently skipped.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['productIds'],
        properties: {
          productIds: {
            type: 'array',
            items: { type: 'string', format: 'uuid' },
            example: ['uuid-1', 'uuid-2'],
          },
        },
      },
    }),
    ApiOkResponse({ description: 'Wishlist merged successfully.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
