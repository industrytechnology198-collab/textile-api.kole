import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AnalyticsService } from './analytics.service';
import {
  ApiGetActionQueue,
  ApiGetRevenue,
  ApiGetQuoteFunnel,
  ApiGetTopCustomers,
} from './decorators/analytics.decorator';

@ApiTags('Analytics (Admin)')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('action-queue')
  @ApiGetActionQueue()
  getActionQueue() {
    return this.analyticsService.getActionQueue();
  }

  @Get('revenue')
  @ApiGetRevenue()
  getRevenue() {
    return this.analyticsService.getRevenue();
  }

  @Get('quote-funnel')
  @ApiGetQuoteFunnel()
  getQuoteFunnel() {
    return this.analyticsService.getQuoteFunnel();
  }

  @Get('top-customers')
  @ApiGetTopCustomers()
  getTopCustomers(@Query('limit') limit?: number) {
    return this.analyticsService.getTopCustomers(limit ? Number(limit) : undefined);
  }
}
