import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function GetProducts() {
  return applyDecorators(
    ApiTags('Product'),
    ApiOperation({
      summary: 'Paginated product list featuring dynamic filtering and sorting',
    }),
    ApiResponse({
      status: 200,
      description: 'Products successfully retrieved.',
    }),
    ApiResponse({
      status: 400,
      description: 'Validation error or invalid slug relationships.',
    }),
  );
}
