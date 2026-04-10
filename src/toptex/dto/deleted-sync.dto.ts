import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class DeletedSyncDto {
  @ApiPropertyOptional({
    description:
      'Only fetch items deleted since this date (e.g. "2026-01-01"). Defaults to last_deleted_sync setting.',
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  deletedSince?: string;
}
