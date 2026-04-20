import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiGetMyQuotes() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get my quote requests',
      description: '🔒 Returns the paginated list of quote requests for the authenticated user.',
    }),
    ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiOkResponse({ description: 'Paginated list of quote requests.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}

export function ApiGetMyQuoteById() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get a single quote request by ID (own)' }),
    ApiOkResponse({ description: 'Quote request detail.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}

export function ApiGetMyStats() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get my quote statistics',
      description: '🔒 Returns totals for the authenticated user: total quotes, pending, delivered, and total spent.',
    }),
    ApiOkResponse({
      description: 'User quote statistics.',
      schema: {
        type: 'object',
        properties: {
          totalQuotes:    { type: 'number', example: 8 },
          pendingCount:   { type: 'number', example: 2 },
          deliveredCount: { type: 'number', example: 3 },
          totalSpent:     { type: 'number', example: 1284.50 },
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
