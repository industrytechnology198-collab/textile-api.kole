import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function ApiRemoveCartItem() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remove an item from the cart' }),
    ApiParam({ name: 'skuId', type: 'string', format: 'uuid' }),
    ApiOkResponse({ description: 'Item removed. Returns full cart.' }),
  );
}
