import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { QuoteRepository } from './repositories/quote.repository';
import { CreateQuoteHandler } from './handlers/create-quote.handler';
import { GetMyQuotesHandler } from './handlers/get-my-quotes.handler';
import { GetMyQuoteByIdHandler } from './handlers/get-my-quote-by-id.handler';
import { AdminGetAllQuotesHandler } from './handlers/admin-get-all-quotes.handler';
import { AdminGetQuoteByIdHandler } from './handlers/admin-get-quote-by-id.handler';
import { AdminUpdateQuoteStatusHandler } from './handlers/admin-update-quote-status.handler';
import { AdminUpdateQuoteNoteHandler } from './handlers/admin-update-quote-note.handler';
import { AdminMarkQuotePaidHandler } from './handlers/admin-mark-quote-paid.handler';
import { GetMyStatsHandler } from './handlers/get-my-stats.handler';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
// EmailService is exported from AuthModule

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [QuoteController],
  providers: [
    QuoteService,
    QuoteRepository,
    CreateQuoteHandler,
    GetMyQuotesHandler,
    GetMyQuoteByIdHandler,
    AdminGetAllQuotesHandler,
    AdminGetQuoteByIdHandler,
    AdminUpdateQuoteStatusHandler,
    AdminUpdateQuoteNoteHandler,
    AdminMarkQuotePaidHandler,
    GetMyStatsHandler,
  ],
})
export class QuoteModule {}
