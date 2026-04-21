import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function ApiSendContactMessage() {
  return applyDecorators(
    ApiOperation({
      summary: 'Send a contact message to the admin',
      description:
        '🌐 **Public endpoint.**\n\n' +
        'Sends a contact message from the user directly to the admin email. ' +
        'No authentication required.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['name', 'email', 'subject', 'message'],
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          subject: { type: 'string', example: 'Question about an order' },
          message: { type: 'string', example: 'Hello, I would like to know...' },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Message sent successfully.' }),
    ApiInternalServerErrorResponse({ description: 'Failed to send the message.' }),
  );
}
