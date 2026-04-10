import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

export function GetSyncStatus() {
  return applyDecorators(
    ApiTags('Sync'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN),
    ApiOperation({
      summary:
        'Get the status of the last upsert and deleted sync runs (admin only)',
    }),
    ApiResponse({ status: 200, description: 'Sync status.' }),
  );
}
