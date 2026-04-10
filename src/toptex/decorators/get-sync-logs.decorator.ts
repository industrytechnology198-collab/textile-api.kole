import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

export function GetSyncLogs() {
  return applyDecorators(
    ApiTags('Sync'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get paginated sync logs (admin only)' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'type', required: false, enum: ['upsert', 'deleted'] }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ['running', 'success', 'failed'],
    }),
    ApiResponse({ status: 200, description: 'Paginated sync logs.' }),
  );
}
