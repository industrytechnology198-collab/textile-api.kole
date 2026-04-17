import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiUpdateMeLanguage() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update preferred language',
      description:
        '🔒 **Authenticated users only.**\n\nSets the language used for all emails sent to this user.\n\nSupported values: `fr`, `en`, `de`, `nl`.',
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['preferredLanguage'],
        properties: {
          preferredLanguage: {
            type: 'string',
            enum: ['fr', 'en', 'de', 'nl'],
            example: 'fr',
          },
        },
      },
    }),
    ApiOkResponse({ description: 'Language preference updated.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
  );
}
