import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiMergeCart() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Merge guest cart into user cart after login',
      description:
        '🔒 **Authenticated users only.**\n\n' +
        'Called immediately after login to merge the locally-stored guest cart ' +
        'into the user\'s server-side cart. ' +
        'Duplicate items are merged by summing their quantities.',
    }),
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
    ApiCreatedResponse({ description: 'Cart merged. Returns the full merged cart.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
