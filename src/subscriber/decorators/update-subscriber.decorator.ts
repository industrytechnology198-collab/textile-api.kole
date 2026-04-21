import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiUpdateSubscriber() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update a subscriber',
      description:
        '🔒 **Admin only.** Updates the email or active status of a subscriber.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'new@example.com' },
          isActive: { type: 'boolean', example: false },
        },
      },
    }),
    ApiOkResponse({ description: 'Subscriber updated.' }),
    ApiNotFoundResponse({ description: 'Subscriber not found.' }),
    ApiConflictResponse({ description: 'Email already in use.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
