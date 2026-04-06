import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function ApiAdminGetUserCart() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "[Admin] Get a specific user's cart" }),
    ApiParam({ name: 'userId', type: 'string', format: 'uuid' }),
    ApiOkResponse({ description: "Returns the user's full cart." }),
  );
}
