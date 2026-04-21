import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function ApiCreateSubscriber() {
  return applyDecorators(
    ApiOperation({
      summary: 'Subscribe to the newsletter',
      description:
        '🌐 **Public endpoint.**\n\n' +
        'Registers an email address as a newsletter subscriber.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Successfully subscribed.' }),
    ApiConflictResponse({ description: 'Email already subscribed.' }),
  );
}
