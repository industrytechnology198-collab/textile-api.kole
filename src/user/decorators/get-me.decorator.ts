import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function ApiGetMe() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get current authenticated user profile' }),
    ApiOkResponse({ description: 'Current user data returned successfully.' }),
  );
}
