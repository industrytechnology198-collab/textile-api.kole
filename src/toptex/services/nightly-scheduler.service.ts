import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { IncrementalSyncService } from './incremental-sync.service';

@Injectable()
export class NightlySchedulerService {
  private readonly logger = new Logger(NightlySchedulerService.name);

  constructor(
    private readonly incrementalSyncService: IncrementalSyncService,
  ) {}

  @Cron('0 2 * * *')
  async runNightlySync(): Promise<void> {
    this.logger.log('Nightly sync started');

    try {
      await this.incrementalSyncService.runUpsertSync();
      this.logger.log('Nightly upsert sync triggered');
    } catch (err) {
      this.logger.error(
        `Nightly upsert sync failed to start: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    // Always run deleted sync regardless of upsert result
    try {
      await this.incrementalSyncService.runDeletedSync();
      this.logger.log('Nightly deleted sync triggered');
    } catch (err) {
      this.logger.error(
        `Nightly deleted sync failed to start: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
