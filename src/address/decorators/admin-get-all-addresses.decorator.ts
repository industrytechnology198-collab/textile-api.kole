import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

export function ApiAdminGetAllAddresses() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get all addresses in the system (Admin only)' }),
    ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 20 }),
    ApiQuery({
      name: 'userId',
      required: false,
      type: String,
      description: 'Filter by user UUID',
    }),
    ApiOkResponse({
      description: 'Paginated list of all addresses with user info',
    }),
  );
}
