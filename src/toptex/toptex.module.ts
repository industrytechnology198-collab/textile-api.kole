import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ToptexApiService } from './services/toptex-api.service';
import { IncrementalSyncService } from './services/incremental-sync.service';
import { NightlySchedulerService } from './services/nightly-scheduler.service';
import { ToptexController } from './toptex.controller';
import { ToptexService } from './toptex.service';
import { ToptexStatusHandler } from './handlers/toptex-status.handler';
import { ToptexSyncHandler } from './handlers/toptex-sync.handler';
import { SyncLogsHandler } from './handlers/sync-logs.handler';
import { ToptexRepository } from './repositories/toptex.repository';
import { IncrementalSyncRepository } from './repositories/incremental-sync.repository';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    HttpModule.register({
      timeout: 100000,
      maxRedirects: 5,
    }),
  ],
  controllers: [ToptexController],
  providers: [
    ToptexApiService,
    ToptexService,
    ToptexStatusHandler,
    ToptexSyncHandler,
    SyncLogsHandler,
    IncrementalSyncService,
    NightlySchedulerService,
    ToptexRepository,
    IncrementalSyncRepository,
  ],
  exports: [ToptexApiService, HttpModule],
})
export class ToptexModule {}
