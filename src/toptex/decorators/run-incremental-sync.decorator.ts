import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { IncrementalSyncDto } from '../dto/incremental-sync.dto';

export function RunIncrementalSync() {
  return applyDecorators(
    ApiTags('Sync'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Trigger incremental upsert sync (admin only)' }),
    ApiBody({ type: IncrementalSyncDto, required: false }),
    ApiResponse({
      status: 201,
      description: 'Upsert sync started in background.',
    }),
  );
}
