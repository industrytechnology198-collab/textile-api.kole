import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

export function RunHardUpsert() {
  return applyDecorators(
    ApiTags('Toptex'),
    ApiOperation({
      summary:
        'Run hard upsert of all Toptex products (updates existing, keeps data, refreshes images with fresh tokens)',
      description:
        'This endpoint performs a full hard upsert of all products. Existing products are updated (including images with fresh tokens), new products are added. NO DATA IS DELETED. Perfect for refreshing expired image tokens.',
    }),
    ApiQuery({
      name: 'startPage',
      required: false,
      type: Number,
      description: 'Starting page number (default: 1)',
    }),
    ApiResponse({
      status: 201,
      description: 'Hard upsert completed successfully with detailed statistics.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error during hard upsert.',
    }),
  );
}
