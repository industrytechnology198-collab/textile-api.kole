import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function ApiGetCart() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Get the current user's cart" }),
    ApiOkResponse({
      description: 'Returns the full cart with all items and total.',
    }),
  );
}
