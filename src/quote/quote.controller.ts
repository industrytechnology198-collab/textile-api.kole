import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/strategies/jwt.strategy';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { GetMyQuotesQueryDto, AdminGetQuotesQueryDto } from './dto/get-quotes-query.dto';
import { AdminUpdateQuoteStatusDto, AdminUpdateQuoteNoteDto } from './dto/admin-update-quote.dto';
import { ApiCreateQuote } from './decorators/create-quote.decorator';
import { ApiGetMyQuotes, ApiGetMyQuoteById, ApiGetMyStats } from './decorators/get-my-quotes.decorator';
import {
  ApiAdminGetAllQuotes,
  ApiAdminGetQuoteById,
  ApiAdminUpdateQuoteStatus,
  ApiAdminUpdateQuoteNote,
  ApiAdminMarkQuotePaid,
} from './decorators/admin-quote.decorator';

@ApiTags('Quote Requests')
@Controller('quotes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  // ─── User routes ───────────────────────────────────────────────────

  @Post()
  @ApiCreateQuote()
  createQuote(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateQuoteDto,
  ) {
    return this.quoteService.createQuote(user.userId, user.email, dto);
  }

  @Get('my')
  @ApiGetMyQuotes()
  getMyQuotes(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetMyQuotesQueryDto,
  ) {
    return this.quoteService.getMyQuotes(user.userId, query);
  }

  @Get('my/stats')
  @ApiGetMyStats()
  getMyStats(@CurrentUser() user: JwtPayload) {
    return this.quoteService.getMyStats(user.userId);
  }

  @Get('my/:id')
  @ApiGetMyQuoteById()
  getMyQuoteById(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    return this.quoteService.getMyQuoteById(id, user.userId);
  }

  // ─── Admin routes ──────────────────────────────────────────────────

  @Get('admin/all')
  @Roles(Role.ADMIN)
  @ApiAdminGetAllQuotes()
  adminGetAllQuotes(@Query() query: AdminGetQuotesQueryDto) {
    return this.quoteService.adminGetAllQuotes(query);
  }

  @Get('admin/:id')
  @Roles(Role.ADMIN)
  @ApiAdminGetQuoteById()
  adminGetQuoteById(@Param('id') id: string) {
    return this.quoteService.adminGetQuoteById(id);
  }

  @Patch('admin/:id/status')
  @Roles(Role.ADMIN)
  @ApiAdminUpdateQuoteStatus()
  adminUpdateStatus(
    @Param('id') id: string,
    @Body() dto: AdminUpdateQuoteStatusDto,
  ) {
    return this.quoteService.adminUpdateQuoteStatus(id, dto);
  }

  @Patch('admin/:id/note')
  @Roles(Role.ADMIN)
  @ApiAdminUpdateQuoteNote()
  adminUpdateNote(
    @Param('id') id: string,
    @Body() dto: AdminUpdateQuoteNoteDto,
  ) {
    return this.quoteService.adminUpdateQuoteNote(id, dto);
  }

  @Patch('admin/:id/mark-paid')
  @Roles(Role.ADMIN)
  @ApiAdminMarkQuotePaid()
  adminMarkAsPaid(@Param('id') id: string) {
    return this.quoteService.adminMarkQuoteAsPaid(id);
  }
}
