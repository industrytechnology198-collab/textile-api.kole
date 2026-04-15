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

export function ApiCreateReview() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Submit a review for a product',
      description:
        '🔒 **Authenticated users only.**\n\n' +
        'Creates a new review for a product. ' +
        'Each user can only submit **one review per product**. ' +
        'Rating must be between 1 and 5.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['productId', 'rating'],
        properties: {
          productId: { type: 'string', format: 'uuid', example: 'uuid-here' },
          rating: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
          comment: { type: 'string', example: 'Great quality, fast shipping!' },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Review created successfully.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
    ApiConflictResponse({ description: 'You have already reviewed this product.' }),
    ApiNotFoundResponse({ description: 'Product not found.' }),
  );
}
