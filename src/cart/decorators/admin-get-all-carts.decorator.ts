import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiAdminGetAllCarts() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '[Admin] Get paginated list of all carts',
      description:
        '🔴 **Admin only.**\n\n' +
        'Returns a paginated list of all user carts across the platform, ' +
        'including owner info and item counts.',
    }),
    ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 20 }),
    ApiOkResponse({ description: 'Paginated list of carts with user info and totals.' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' }),
    ApiForbiddenResponse({ description: 'Authenticated user is not an admin.' }),
  );
}
