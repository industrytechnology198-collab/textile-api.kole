import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function ApiUpdateCartItem() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update quantity of a cart item' }),
    ApiParam({ name: 'skuId', type: 'string', format: 'uuid' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['quantity'],
        properties: {
          quantity: { type: 'integer', minimum: 1, example: 3 },
        },
      },
    }),
    ApiOkResponse({ description: 'Cart item updated. Returns full cart.' }),
  );
}
