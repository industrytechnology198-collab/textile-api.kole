import { Injectable } from '@nestjs/common';
import { ActionQueueHandler } from './handlers/action-queue.handler';
import { RevenueHandler } from './handlers/revenue.handler';
import { QuoteFunnelHandler } from './handlers/quote-funnel.handler';
import { TopCustomersHandler } from './handlers/top-customers.handler';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly actionQueueHandler: ActionQueueHandler,
    private readonly revenueHandler: RevenueHandler,
    private readonly quoteFunnelHandler: QuoteFunnelHandler,
    private readonly topCustomersHandler: TopCustomersHandler,
  ) {}

  getActionQueue() {
    return this.actionQueueHandler.execute();
  }

  getRevenue() {
    return this.revenueHandler.execute();
  }

  getQuoteFunnel() {
    return this.quoteFunnelHandler.execute();
  }

  getTopCustomers(limit?: number) {
    return this.topCustomersHandler.execute(limit);
  }
}
