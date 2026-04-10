import { Injectable, NotFoundException } from '@nestjs/common';
import { SyncLog } from '@prisma/client';
import {
  IncrementalSyncRepository,
  PaginatedSyncLogs,
} from '../repositories/incremental-sync.repository';
import { GetSyncLogsQueryDto } from '../dto/get-sync-logs-query.dto';

export interface SyncStatusEntry {
  status: string | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  processedItems: number | null;
  failedItems: number | null;
}

export interface SyncStatusResponse {
  upsert: SyncStatusEntry;
  deleted: SyncStatusEntry;
  lastUpsertSyncDate: string | null;
  lastDeletedSyncDate: string | null;
}

function toStatusEntry(log: SyncLog | null): SyncStatusEntry {
  return {
    status: log?.status ?? null,
    startedAt: log?.startedAt ?? null,
    finishedAt: log?.finishedAt ?? null,
    processedItems: log?.processedItems ?? null,
    failedItems: log?.failedItems ?? null,
  };
}

@Injectable()
export class SyncLogsHandler {
  constructor(private readonly syncRepo: IncrementalSyncRepository) {}

  async getLogs(query: GetSyncLogsQueryDto): Promise<PaginatedSyncLogs> {
    return this.syncRepo.findSyncLogs({
      page: query.page,
      limit: query.limit,
      type: query.type,
      status: query.status,
    });
  }

  async getLogById(id: string): Promise<SyncLog> {
    const log = await this.syncRepo.findSyncLogById(id);
    if (!log) throw new NotFoundException(`SyncLog ${id} not found`);
    return log;
  }

  async getSyncStatus(): Promise<SyncStatusResponse> {
    const [upsertLog, deletedLog, lastUpsertDate, lastDeletedDate] =
      await Promise.all([
        this.syncRepo.findLastSyncLogByType('upsert'),
        this.syncRepo.findLastSyncLogByType('deleted'),
        this.syncRepo.getSetting('last_upsert_sync'),
        this.syncRepo.getSetting('last_deleted_sync'),
      ]);

    return {
      upsert: toStatusEntry(upsertLog),
      deleted: toStatusEntry(deletedLog),
      lastUpsertSyncDate: lastUpsertDate,
      lastDeletedSyncDate: lastDeletedDate,
    };
  }
}
