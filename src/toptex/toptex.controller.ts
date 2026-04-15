import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ToptexService } from './toptex.service';
import { Public } from 'src/common/decorators/public.decorator';
import { GetToptexStatus } from './decorators/get-toptex-status.decorator';
import { SyncToptex } from './decorators/sync-toptex.decorator';
import { RunHardUpsert } from './decorators/run-hard-upsert.decorator';
import { SyncToptexDto } from './dto/sync-toptex.dto';
import { RunIncrementalSync } from './decorators/run-incremental-sync.decorator';
import { RunDeletedSync } from './decorators/run-deleted-sync.decorator';
import { GetSyncLogs } from './decorators/get-sync-logs.decorator';
import { GetSyncLogById } from './decorators/get-sync-log-by-id.decorator';
import { GetSyncStatus } from './decorators/get-sync-status.decorator';
import { IncrementalSyncDto } from './dto/incremental-sync.dto';
import { DeletedSyncDto } from './dto/deleted-sync.dto';
import { GetSyncLogsQueryDto } from './dto/get-sync-logs-query.dto';

@Controller('sync')
export class ToptexController {
  constructor(private readonly toptexService: ToptexService) {}

  @Public()
  @Get('status')
  @GetToptexStatus()
  async getStatus() {
    return this.toptexService.checkStatus();
  }

  @Public()
  @Post('full')
  @SyncToptex()
  async runSync(@Body() dto: SyncToptexDto) {
    return this.toptexService.runFullSync(dto);
  }

  @Public()
  @Post('hard-upsert')
  @RunHardUpsert()
  async runHardUpsert(@Query('startPage') startPage?: number) {
    return this.toptexService.runHardUpsert(startPage || 1);
  }

  @Post('incremental')
  @RunIncrementalSync()
  async runIncrementalSync(@Body() dto: IncrementalSyncDto) {
    return this.toptexService.runIncrementalSync(dto.modifiedSince);
  }

  @Post('deleted')
  @RunDeletedSync()
  async runDeletedSync(@Body() dto: DeletedSyncDto) {
    return this.toptexService.runDeletedSync(dto.deletedSince);
  }

  @Get('logs')
  @GetSyncLogs()
  async getSyncLogs(@Query() query: GetSyncLogsQueryDto) {
    return this.toptexService.getSyncLogs(query);
  }

  @Get('logs/:id')
  @GetSyncLogById()
  async getSyncLogById(@Param('id') id: string): Promise<unknown> {
    return this.toptexService.getSyncLogById(id);
  }

  @Get('sync-status')
  @GetSyncStatus()
  async getSyncStatus() {
    return this.toptexService.getSyncStatus();
  }
}
