import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

export function ApiAdminGetAllCarts() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '[Admin] Get paginated list of all carts' }),
    ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 20 }),
    ApiOkResponse({
      description: 'Paginated carts with user info and totals.',
    }),
  );
}
