import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function ApiGetAddress() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get a single address by ID' }),
    ApiParam({ name: 'id', type: 'string', format: 'uuid' }),
    ApiOkResponse({ description: 'Address found' }),
    ApiNotFoundResponse({ description: 'Address not found' }),
    ApiForbiddenResponse({
      description: 'Address does not belong to the current user',
    }),
  );
}
