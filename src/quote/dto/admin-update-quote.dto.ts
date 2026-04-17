import { QuoteStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class AdminUpdateQuoteStatusDto {
  @IsEnum(QuoteStatus)
  status!: QuoteStatus;
}

export class AdminUpdateQuoteNoteDto {
  @IsString()
  @IsOptional()
  adminNote!: string;
}
