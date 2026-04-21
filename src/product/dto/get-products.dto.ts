import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class GetProductsDto {
  @ApiProperty({ description: 'Language ("en" | "fr" | "de" | "nl")' })
  @IsString()
  @IsIn(['en', 'fr', 'de', 'nl'])
  lang!: string;

  @ApiPropertyOptional({
    description: 'Search term (min 2 chars) — scopes results to matching products while keeping all active filters',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  q?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subCategorySlug?: string;

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

  @ApiPropertyOptional({
    default: 'newest',
    enum: ['price_asc', 'price_desc', 'newest'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['price_asc', 'price_desc', 'newest'])
  sortBy: string = 'newest';

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === '1')
  @IsBoolean()
  organic?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === '1')
  @IsBoolean()
  recycled?: boolean;

  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by hex color codes e.g. ["#000000","#ffffff"]',
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by size labels e.g. ["S","M","L"]',
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by brand names e.g. ["Beechfield®","Kariban"]',
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  brands?: string[];
}
