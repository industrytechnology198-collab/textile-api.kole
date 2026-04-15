import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function ApiFindAllByProduct() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all reviews for a product',
      description:
        '🌐 **Public — no authentication required.**\n\n' +
        'Returns all approved reviews for a given product, ordered by most recent first. ' +
        'Includes reviewer first and last name.',
    }),
    ApiParam({
      name: 'productId',
      type: 'string',
      format: 'uuid',
      description: 'ID of the product to fetch reviews for',
    }),
    ApiOkResponse({ description: 'List of reviews for the product, newest first.' }),
    ApiNotFoundResponse({ description: 'Product not found.' }),
  );
}
