import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetSyncLogsQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @ApiPropertyOptional({ enum: ['upsert', 'deleted', 'hard-upsert'] })
  @IsOptional()
  @IsString()
  @IsIn(['upsert', 'deleted', 'hard-upsert'])
  type?: string;

  @ApiPropertyOptional({ enum: ['running', 'success', 'failed'] })
  @IsOptional()
  @IsString()
  @IsIn(['running', 'success', 'failed'])
  status?: string;
}
