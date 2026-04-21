import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiSetReviewVisibility() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Approve or hide a review',
      description:
        '🔒 **Admin only.** Controls whether a review is publicly visible. ' +
        'New reviews are hidden by default until an admin approves them.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['isVisible'],
        properties: {
          isVisible: { type: 'boolean', example: true },
        },
      },
    }),
    ApiOkResponse({ description: 'Review visibility updated.' }),
    ApiNotFoundResponse({ description: 'Review not found.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
