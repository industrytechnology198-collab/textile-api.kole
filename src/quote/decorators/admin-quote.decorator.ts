import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiAdminGetAllQuotes() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '[Admin] Get all quote requests',
      description: '🔒🛡️ **Admin only.** Returns all quote requests with user and address info.',
    }),
    ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiOkResponse({ description: 'Paginated list of all quote requests.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}

export function ApiAdminGetQuoteById() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '[Admin] Get a single quote by ID',
      description: '🔒🛡️ **Admin only.** Returns full quote detail including user, address, and items.',
    }),
    ApiOkResponse({ description: 'Quote request detail.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}

export function ApiAdminUpdateQuoteStatus() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '[Admin] Update quote status' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
        },
      },
    }),
    ApiOkResponse({ description: 'Status updated.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}

export function ApiAdminUpdateQuoteNote() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '[Admin] Update admin note on a quote' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          adminNote: { type: 'string', example: 'Called client — will ship Monday' },
        },
      },
    }),
    ApiOkResponse({ description: 'Admin note updated.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}

export function ApiAdminMarkQuotePaid() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '[Admin] Mark a quote as paid',
      description: '🔒🛡️ **Admin only.** Sets isPaid = true and records paidAt timestamp.',
    }),
    ApiOkResponse({ description: 'Quote marked as paid.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
