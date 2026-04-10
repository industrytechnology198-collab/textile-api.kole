import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class IncrementalSyncDto {
  @ApiPropertyOptional({
    description:
      'Only sync products modified since this date (e.g. "2026-01-01")',
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  modifiedSince?: string;
}
