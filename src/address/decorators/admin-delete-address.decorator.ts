import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function ApiAdminDeleteAddress() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Admin: delete any address by ID' }),
    ApiParam({ name: 'id', type: 'string', format: 'uuid' }),
    ApiOkResponse({ description: 'Address deleted successfully' }),
    ApiNotFoundResponse({ description: 'Address not found' }),
    ApiBadRequestResponse({
      description: "Cannot delete the user's only address",
    }),
  );
}
