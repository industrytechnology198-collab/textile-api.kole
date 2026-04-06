import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function ApiUpdateAddress() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update an address by ID' }),
    ApiParam({ name: 'id', type: 'string', format: 'uuid' }),
    ApiOkResponse({ description: 'Address updated successfully' }),
    ApiNotFoundResponse({ description: 'Address not found' }),
    ApiForbiddenResponse({
      description: 'Address does not belong to the current user',
    }),
  );
}
