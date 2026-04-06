import { Injectable } from '@nestjs/common';
import { ToptexStatusHandler } from './handlers/toptex-status.handler';
import { ToptexSyncHandler } from './handlers/toptex-sync.handler';
import { SyncToptexDto } from './dto/sync-toptex.dto';

@Injectable()
export class ToptexService {
  constructor(
    private readonly statusHandler: ToptexStatusHandler,
    private readonly syncHandler: ToptexSyncHandler,
  ) {}

  async checkStatus() {
    return this.statusHandler.execute();
  }

  async runFullSync(dto?: SyncToptexDto) {
    return this.syncHandler.execute(dto?.continue, dto?.page);
  }
}
