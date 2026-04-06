import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function ApiClearCart() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Clear all items from the cart' }),
    ApiOkResponse({ description: 'Cart cleared successfully.' }),
  );
}
