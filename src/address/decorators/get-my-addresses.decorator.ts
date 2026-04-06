import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function ApiGetMyAddresses() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get all addresses of the current user' }),
    ApiOkResponse({
      description: 'List of addresses belonging to the current user',
    }),
  );
}
