import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function ApiGetUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get a user by ID (Admin only)' }),
    ApiParam({ name: 'id', type: 'string', format: 'uuid' }),
    ApiOkResponse({ description: 'User returned successfully.' }),
    ApiNotFoundResponse({ description: 'User not found.' }),
  );
}
