import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiRemoveSubscriber() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete a subscriber',
      description: '🔒 **Admin only.** Permanently removes a subscriber.',
    }),
    ApiOkResponse({ description: 'Subscriber removed.' }),
    ApiNotFoundResponse({ description: 'Subscriber not found.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
