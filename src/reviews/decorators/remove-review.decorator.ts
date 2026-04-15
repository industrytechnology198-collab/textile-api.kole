import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiRemoveReview() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete a review',
      description:
        '🔒 **Authenticated users — owner or admin.**\n\n' +
        'Deletes a review by ID.\n\n' +
        '- **Regular users** can only delete their own reviews.\n' +
        '- **Admins** can delete any review regardless of ownership.',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      format: 'uuid',
      description: 'ID of the review to delete',
    }),
    ApiOkResponse({ description: 'Review deleted successfully.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
    ApiForbiddenResponse({ description: 'You can only delete your own reviews.' }),
    ApiNotFoundResponse({ description: 'Review not found.' }),
  );
}
