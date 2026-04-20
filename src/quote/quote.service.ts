import { Injectable } from '@nestjs/common';
import { QuoteStatus } from '@prisma/client';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { GetMyQuotesQueryDto, AdminGetQuotesQueryDto } from './dto/get-quotes-query.dto';
import { AdminUpdateQuoteStatusDto, AdminUpdateQuoteNoteDto } from './dto/admin-update-quote.dto';
import { CreateQuoteHandler } from './handlers/create-quote.handler';
import { GetMyQuotesHandler } from './handlers/get-my-quotes.handler';
import { GetMyQuoteByIdHandler } from './handlers/get-my-quote-by-id.handler';
import { AdminGetAllQuotesHandler } from './handlers/admin-get-all-quotes.handler';
import { AdminGetQuoteByIdHandler } from './handlers/admin-get-quote-by-id.handler';
import { AdminUpdateQuoteStatusHandler } from './handlers/admin-update-quote-status.handler';
import { AdminUpdateQuoteNoteHandler } from './handlers/admin-update-quote-note.handler';
import { AdminMarkQuotePaidHandler } from './handlers/admin-mark-quote-paid.handler';
import { GetMyStatsHandler } from './handlers/get-my-stats.handler';

@Injectable()
export class QuoteService {
  constructor(
    private readonly createQuoteHandler: CreateQuoteHandler,
    private readonly getMyQuotesHandler: GetMyQuotesHandler,
    private readonly getMyQuoteByIdHandler: GetMyQuoteByIdHandler,
    private readonly adminGetAllQuotesHandler: AdminGetAllQuotesHandler,
    private readonly adminGetQuoteByIdHandler: AdminGetQuoteByIdHandler,
    private readonly adminUpdateQuoteStatusHandler: AdminUpdateQuoteStatusHandler,
    private readonly adminUpdateQuoteNoteHandler: AdminUpdateQuoteNoteHandler,
    private readonly adminMarkQuotePaidHandler: AdminMarkQuotePaidHandler,
    private readonly getMyStatsHandler: GetMyStatsHandler,
  ) {}

  createQuote(userId: string, userEmail: string, dto: CreateQuoteDto) {
    return this.createQuoteHandler.execute(userId, userEmail, dto);
  }

  getMyQuotes(userId: string, query: GetMyQuotesQueryDto) {
    return this.getMyQuotesHandler.execute(userId, query);
  }

  getMyQuoteById(id: string, userId: string) {
    return this.getMyQuoteByIdHandler.execute(id, userId);
  }

  adminGetAllQuotes(query: AdminGetQuotesQueryDto) {
    return this.adminGetAllQuotesHandler.execute(query);
  }

  adminGetQuoteById(id: string) {
    return this.adminGetQuoteByIdHandler.execute(id);
  }

  adminUpdateQuoteStatus(id: string, dto: AdminUpdateQuoteStatusDto) {
    return this.adminUpdateQuoteStatusHandler.execute(id, dto.status);
  }

  adminUpdateQuoteNote(id: string, dto: AdminUpdateQuoteNoteDto) {
    return this.adminUpdateQuoteNoteHandler.execute(id, dto.adminNote);
  }

  adminMarkQuoteAsPaid(id: string) {
    return this.adminMarkQuotePaidHandler.execute(id);
  }

  getMyStats(userId: string) {
    return this.getMyStatsHandler.execute(userId);
  }
}
