import { Injectable } from '@nestjs/common';
import { SyncLog } from '@prisma/client';
import { ToptexStatusHandler } from './handlers/toptex-status.handler';
import { ToptexSyncHandler } from './handlers/toptex-sync.handler';
import { ToptexHardUpsertHandler, type HardUpsertStats } from './handlers/toptex-hard-upsert.handler';
import {
  SyncLogsHandler,
  SyncStatusResponse,
} from './handlers/sync-logs.handler';
import { IncrementalSyncService } from './services/incremental-sync.service';
import { SyncToptexDto } from './dto/sync-toptex.dto';
import { GetSyncLogsQueryDto } from './dto/get-sync-logs-query.dto';
import { PaginatedSyncLogs } from './repositories/incremental-sync.repository';

@Injectable()
export class ToptexService {
  constructor(
    private readonly statusHandler: ToptexStatusHandler,
    private readonly syncHandler: ToptexSyncHandler,
    private readonly hardUpsertHandler: ToptexHardUpsertHandler,
    private readonly syncLogsHandler: SyncLogsHandler,
    private readonly incrementalSyncService: IncrementalSyncService,
  ) {}

  async checkStatus() {
    return this.statusHandler.execute();
  }

  async runFullSync(dto?: SyncToptexDto) {
    return this.syncHandler.execute(dto?.continue, dto?.page);
  }

  async runHardUpsert(
    startPage: number = 1,
  ): Promise<{ message: string; stats: HardUpsertStats }> {
    return this.hardUpsertHandler.execute(startPage);
  }

  async runIncrementalSync(
    modifiedSince?: string,
  ): Promise<{ message: string; syncLogId: string }> {
    const syncLogId =
      await this.incrementalSyncService.runUpsertSync(modifiedSince);
    return { message: 'Upsert sync started', syncLogId };
  }

  async runDeletedSync(
    deletedSince?: string,
  ): Promise<{ message: string; syncLogId: string }> {
    const syncLogId =
      await this.incrementalSyncService.runDeletedSync(deletedSince);
    return { message: 'Deleted sync started', syncLogId };
  }

  async getSyncLogs(query: GetSyncLogsQueryDto): Promise<PaginatedSyncLogs> {
    return this.syncLogsHandler.getLogs(query);
  }

  async getSyncLogById(id: string): Promise<SyncLog> {
    return this.syncLogsHandler.getLogById(id);
  }

  async getSyncStatus(): Promise<SyncStatusResponse> {
    return this.syncLogsHandler.getSyncStatus();
  }
}
