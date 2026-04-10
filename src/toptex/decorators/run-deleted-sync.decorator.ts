import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { DeletedSyncDto } from '../dto/deleted-sync.dto';

export function RunDeletedSync() {
  return applyDecorators(
    ApiTags('Sync'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Trigger deleted-items sync (admin only)' }),
    ApiBody({ type: DeletedSyncDto, required: false }),
    ApiResponse({
      status: 201,
      description: 'Deleted sync started in background.',
    }),
  );
}
