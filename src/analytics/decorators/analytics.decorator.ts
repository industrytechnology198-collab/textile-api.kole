import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiGetActionQueue() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '[Admin] Action queue — what needs attention right now',
      description: '🔒🛡️ **Admin only.** Returns pending quotes, confirmed-unpaid quotes, paid-but-stuck quotes, and processing-stuck quotes.',
    }),
    ApiOkResponse({ description: 'Action queue items.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}

export function ApiGetRevenue() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '[Admin] Revenue — this month vs last month + weekly chart',
      description: '🔒🛡️ **Admin only.** Returns revenue totals, trend percentage, average quote value, and revenue by ISO week for the last 12 weeks.',
    }),
    ApiOkResponse({ description: 'Revenue analytics.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}

export function ApiGetQuoteFunnel() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '[Admin] Quote funnel — count per status',
      description: '🔒🛡️ **Admin only.** Returns quote counts for each status stage so the admin can see where things are stuck.',
    }),
    ApiOkResponse({ description: 'Quote funnel data.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}

export function ApiGetTopCustomers() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '[Admin] Top customers by paid revenue',
      description: '🔒🛡️ **Admin only.** Returns the top customers ranked by total amount paid.',
    }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of customers to return (default: 10)' }),
    ApiOkResponse({ description: 'Top customers list.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
