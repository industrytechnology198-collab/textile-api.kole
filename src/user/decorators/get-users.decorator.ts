import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

export function ApiGetUsers() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get all users (Admin only)' }),
    ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 20 }),
    ApiOkResponse({ description: 'Paginated list of users' }),
  );
}
