import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { SyncToptexDto } from '../dto/sync-toptex.dto';

export function SyncToptex() {
  return applyDecorators(
    ApiTags('Toptex'),
    ApiOperation({
      summary: 'Run a full sync of all Toptex products (clears existing data)',
    }),
    ApiBody({ type: SyncToptexDto, required: false }),
    ApiResponse({ status: 201, description: 'Sync completed successfully.' }),
    ApiResponse({
      status: 500,
      description: 'Internal server error during sync.',
    }),
  );
}
