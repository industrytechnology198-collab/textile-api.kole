import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function GetFilters() {
  return applyDecorators(
    ApiTags('Product'),
    ApiOperation({
      summary:
        'Faceted filter aggregation — returns available options and counts for the current active filters',
    }),
    ApiResponse({
      status: 200,
      description: 'Filter options successfully retrieved.',
    }),
    ApiResponse({
      status: 400,
      description: 'Validation error or invalid slug relationships.',
    }),
  );
}
