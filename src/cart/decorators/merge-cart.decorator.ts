import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function ApiMergeCart() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Merge guest cart into user cart after login' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['items'],
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                skuId: { type: 'string', format: 'uuid' },
                quantity: { type: 'integer', minimum: 1 },
              },
            },
          },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Cart merged. Returns full cart.' }),
  );
}
