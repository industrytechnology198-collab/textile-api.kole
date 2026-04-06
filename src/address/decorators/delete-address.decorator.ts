import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function ApiDeleteAddress() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete an address by ID' }),
    ApiParam({ name: 'id', type: 'string', format: 'uuid' }),
    ApiOkResponse({ description: 'Address deleted successfully' }),
    ApiNotFoundResponse({ description: 'Address not found' }),
    ApiForbiddenResponse({
      description: 'Address does not belong to the current user',
    }),
    ApiBadRequestResponse({
      description:
        'Cannot delete the only address. Please add another address first',
    }),
  );
}
