import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class QuoteItemDto {
  @IsUUID()
  @IsNotEmpty()
  skuId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class CreateQuoteDto {
  @IsUUID()
  @IsNotEmpty()
  addressId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items!: QuoteItemDto[];

  @IsOptional()
  @IsString()
  note?: string;
}
