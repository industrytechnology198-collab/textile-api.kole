import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function ApiLogout() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Logout and revoke refresh token' }),
    ApiOkResponse({
      description: 'Logged out successfully',
      schema: { example: { message: 'Logged out successfully' } },
    }),
  );
}
