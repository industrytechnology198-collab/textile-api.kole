import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function ApiCreateAddress() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new address for the current user' }),
    ApiBody({
      schema: {
        type: 'object',
        required: [
          'fullName',
          'phoneNumber',
          'addressLine1',
          'city',
          'postalCode',
          'country',
        ],
        properties: {
          fullName: { type: 'string', example: 'John Doe' },
          phoneNumber: { type: 'string', example: '+1234567890' },
          addressLine1: { type: 'string', example: '123 Main St' },
          addressLine2: { type: 'string', example: 'Apt 4B' },
          city: { type: 'string', example: 'New York' },
          state: { type: 'string', example: 'NY' },
          postalCode: { type: 'string', example: '10001' },
          country: { type: 'string', example: 'US' },
          isDefault: { type: 'boolean', example: true },
        },
      },
    }),
    ApiCreatedResponse({ description: 'Address created successfully' }),
  );
}
