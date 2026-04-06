import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class GetCategoriesDto {
  @ApiProperty({ description: 'Language ("en" | "fr" | "de")' })
  @IsString()
  @IsIn(['en', 'fr', 'de'])
  lang!: string;
}
