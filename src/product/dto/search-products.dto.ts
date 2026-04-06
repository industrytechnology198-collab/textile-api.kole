import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SearchProductsDto {
  @ApiProperty({ description: 'Language ("en" | "fr" | "de")' })
  @IsString()
  @IsIn(['en', 'fr', 'de'])
  lang!: string;

  @ApiProperty({
    description: 'Search term, minimum 2 characters',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  q!: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 24, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 24;
}
