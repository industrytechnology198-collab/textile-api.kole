import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiFindAllReviews() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '[Admin] Get all reviews',
      description:
        '🔴 **Admin only.**\n\n' +
        'Returns every review across all products and users, ordered by most recent first. ' +
        'Includes reviewer info and product reference.',
    }),
    ApiOkResponse({ description: 'Full list of all reviews, newest first.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
    ApiForbiddenResponse({ description: 'Authenticated user is not an admin.' }),
  );
}
