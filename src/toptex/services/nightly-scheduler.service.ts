import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { IncrementalSyncService } from './incremental-sync.service';
import { ToptexHardUpsertHandler } from '../handlers/toptex-hard-upsert.handler';

@Injectable()
export class NightlySchedulerService {
  private readonly logger = new Logger(NightlySchedulerService.name);

  constructor(
    private readonly incrementalSyncService: IncrementalSyncService,
    private readonly hardUpsertHandler: ToptexHardUpsertHandler,
  ) {}

  @Cron('0 2 * * *')
  async runNightlyHardUpsertWithDelete(): Promise<void> {
    this.logger.log('Nightly hard upsert + delete sync started');

    // Step 1: Run full hard upsert (creates/updates all products)
    try {
      await this.hardUpsertHandler.executeSync(1);
      this.logger.log('Nightly hard upsert completed');
    } catch (err) {
      this.logger.error(
        `Nightly hard upsert failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    // Step 2: Always run deleted sync after hard upsert
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
