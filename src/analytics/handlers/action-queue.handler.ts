import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';

@Injectable()
export class ActionQueueHandler {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async execute() {
    const [
      pendingCount,
      confirmedUnpaid,
      paidNotAdvanced,
      stuckProcessing,
    ] = await Promise.all([
      this.analyticsRepository.countPendingQuotes(),
      this.analyticsRepository.findConfirmedUnpaid(),
      this.analyticsRepository.findPaidButNotAdvanced(),
      this.analyticsRepository.findStuckProcessing(7),
    ]);

    return {
      pendingQuotes: {
        count: pendingCount,
        message: pendingCount > 0
          ? `${pendingCount} quote(s) waiting for your response`
          : 'No pending quotes',
      },
      confirmedUnpaid: {
        count: confirmedUnpaid.length,
        items: confirmedUnpaid,
        message: confirmedUnpaid.length > 0
          ? `${confirmedUnpaid.length} confirmed quote(s) awaiting payment`
          : 'All confirmed quotes are paid',
      },
      paidNotAdvanced: {
        count: paidNotAdvanced.length,
        items: paidNotAdvanced,
        message: paidNotAdvanced.length > 0
          ? `${paidNotAdvanced.length} paid quote(s) still marked as CONFIRMED — start processing?`
          : null,
      },
      stuckProcessing: {
        count: stuckProcessing.length,
        items: stuckProcessing,
        message: stuckProcessing.length > 0
          ? `${stuckProcessing.length} quote(s) in PROCESSING for more than 7 days`
          : null,
      },
    };
  }
}
