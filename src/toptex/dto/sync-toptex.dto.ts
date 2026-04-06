import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min, ValidateIf } from 'class-validator';

export class SyncToptexDto {
  @ApiPropertyOptional({
    description:
      'Whether to continue from a previous sync page. If false, wipes all data.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  continue?: boolean;

  @ApiPropertyOptional({
    description:
      'The page number to continue from. Required if continue is true.',
    minimum: 1,
  })
  @ValidateIf((o) => o.continue === true)
  @IsInt({ message: 'page must be an integer when continue is true' })
  @Min(1, { message: 'page must be at least 1' })
  page?: number;
}
