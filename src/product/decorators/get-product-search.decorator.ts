import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function GetProductSearch() {
  return applyDecorators(
    ApiTags('Product'),
    ApiOperation({
      summary:
        'Full-text product search across name, description, color name, brand and catalog reference',
    }),
    ApiResponse({
      status: 200,
      description: 'Search results successfully retrieved.',
    }),
    ApiResponse({
      status: 400,
      description: 'Validation error — query must be at least 2 characters.',
    }),
  );
}
