import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiAdminGetUserCart() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: "[Admin] Get a specific user's cart",
      description:
        '🔴 **Admin only.**\n\n' +
        "Retrieves the full cart for any user by their ID, including all items and pricing.",
    }),
    ApiParam({ name: 'userId', type: 'string', format: 'uuid', description: 'ID of the user whose cart to retrieve' }),
    ApiOkResponse({ description: "Returns the user's full cart with all items and pricing." }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
    ApiForbiddenResponse({ description: 'Authenticated user is not an admin.' }),
  );
}
