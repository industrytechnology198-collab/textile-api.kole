import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiCreateQuote() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Submit a quote request',
      description:
        '🔒 **Authenticated users only.**\n\n' +
        'Submits a quote request with selected variants and quantities.\n\n' +
        '**Rules:**\n' +
        '- User must be logged in\n' +
        '- The `addressId` must belong to the authenticated user\n' +
        '- The address must have a phone number\n' +
        '- All SKUs must be active and not discontinued\n' +
        '- Prices are automatically doubled (×2) server-side\n\n' +
        'On success, a confirmation email is sent to the user and to the admin.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['addressId', 'items'],
        properties: {
          addressId: { type: 'string', format: 'uuid', example: 'uuid-here' },
          note: { type: 'string', example: 'Please ship as soon as possible' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['skuId', 'quantity'],
              properties: {
                skuId: { type: 'string', format: 'uuid' },
                quantity: { type: 'integer', minimum: 1, example: 3 },
              },
            },
          },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Quote request created successfully.' }),
    ApiBadRequestResponse({ description: 'Validation failed / SKU unavailable / no phone.' }),
    ApiForbiddenResponse({ description: 'Address does not belong to you.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
