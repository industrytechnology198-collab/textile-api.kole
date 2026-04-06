import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function ApiDeleteUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a user by ID (Admin only)' }),
    ApiParam({ name: 'id', type: 'string', format: 'uuid' }),
    ApiOkResponse({ description: 'User deleted successfully.' }),
    ApiNotFoundResponse({ description: 'User not found.' }),
    ApiBadRequestResponse({ description: 'Admin cannot delete themselves.' }),
  );
}
