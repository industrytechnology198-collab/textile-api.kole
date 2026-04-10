import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiRefresh() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh access token using httpOnly cookie' }),
    ApiOkResponse({
      description: 'Returns new access token',
      schema: { example: { accessToken: 'jwt...' } },
    }),
    ApiUnauthorizedResponse({
      description: 'Refresh token missing or invalid',
    }),
  );
}
