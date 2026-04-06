import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function GetCategories() {
  return applyDecorators(
    ApiTags('Category'),
    ApiOperation({
      summary: 'List hierarchical category trees that contain active products',
    }),
    ApiResponse({
      status: 200,
      description: 'Categories successfully retrieved.',
    }),
  );
}
