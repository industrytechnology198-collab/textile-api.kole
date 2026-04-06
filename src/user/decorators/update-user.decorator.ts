import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto';

export function ApiUpdateUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Admin update user by ID' }),
    ApiParam({ name: 'id', type: 'string', format: 'uuid' }),
    ApiBody({ type: AdminUpdateUserDto }),
    ApiOkResponse({ description: 'User updated successfully.' }),
    ApiNotFoundResponse({ description: 'User not found.' }),
  );
}
