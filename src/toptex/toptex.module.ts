import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ToptexApiService } from './services/toptex-api.service';
import { ToptexController } from './toptex.controller';
import { ToptexService } from './toptex.service';
import { ToptexStatusHandler } from './handlers/toptex-status.handler';
import { ToptexSyncHandler } from './handlers/toptex-sync.handler';
import { ToptexRepository } from './repositories/toptex.repository';

@Module({
  imports: [
    ConfigModule,
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
    ToptexRepository,
  ],
  exports: [ToptexApiService, HttpModule],
})
export class ToptexModule {}
