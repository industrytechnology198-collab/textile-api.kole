import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

export function GetSyncLogById() {
  return applyDecorators(
    ApiTags('Sync'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get a single sync log by ID (admin only)' }),
    ApiParam({ name: 'id', type: String }),
    ApiResponse({ status: 200, description: 'Sync log entry.' }),
    ApiResponse({ status: 404, description: 'Sync log not found.' }),
  );
}
