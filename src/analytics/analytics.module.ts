import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsRepository } from './repositories/analytics.repository';
import { ActionQueueHandler } from './handlers/action-queue.handler';
import { RevenueHandler } from './handlers/revenue.handler';
import { QuoteFunnelHandler } from './handlers/quote-funnel.handler';
import { TopCustomersHandler } from './handlers/top-customers.handler';

@Module({
  imports: [PrismaModule],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    AnalyticsRepository,
    ActionQueueHandler,
    RevenueHandler,
    QuoteFunnelHandler,
    TopCustomersHandler,
  ],
})
export class AnalyticsModule {}
