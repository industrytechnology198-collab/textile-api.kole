import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiUpdateReview() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update your own review',
      description:
        '🔒 **Authenticated users only — owner only.**\n\n' +
        'Allows a user to edit the rating or comment of a review they previously submitted. ' +
        'Users cannot edit reviews that belong to other users.',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      format: 'uuid',
      description: 'ID of the review to update',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
          comment: { type: 'string', example: 'Updated — even better than I thought!' },
        },
      },
    }),
    ApiOkResponse({ description: 'Review updated successfully.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
    ApiForbiddenResponse({ description: 'You can only edit your own reviews.' }),
    ApiNotFoundResponse({ description: 'Review not found.' }),
  );
}
