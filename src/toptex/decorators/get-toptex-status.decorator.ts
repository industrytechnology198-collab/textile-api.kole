import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function GetToptexStatus() {
  return applyDecorators(
    ApiTags('Toptex'),
    ApiOperation({ summary: 'Check Toptex API Authentication Status' }),
    ApiResponse({ status: 200, description: 'Authentication is successful.' }),
    ApiResponse({ status: 401, description: 'Authentication failed.' }),
  );
}
