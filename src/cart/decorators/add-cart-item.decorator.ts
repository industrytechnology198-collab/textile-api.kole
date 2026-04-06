import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function ApiAddCartItem() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Add an item to the cart' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['skuId', 'quantity'],
        properties: {
          skuId: { type: 'string', format: 'uuid', example: 'uuid-here' },
          quantity: { type: 'integer', minimum: 1, example: 2 },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'Item added to cart. Returns full cart.',
    }),
  );
}
