import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiFindAllSubscribers() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all subscribers',
      description: '🔒 **Admin only.** Returns the full list of newsletter subscribers.',
    }),
    ApiOkResponse({ description: 'List of subscribers.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
