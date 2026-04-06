import { Controller, Get, Post, Body } from '@nestjs/common';
import { ToptexService } from './toptex.service';
import { Public } from 'src/common/decorators/public.decorator';
import { GetToptexStatus } from './decorators/get-toptex-status.decorator';
import { SyncToptex } from './decorators/sync-toptex.decorator';
import { SyncToptexDto } from './dto/sync-toptex.dto';

@Public()
@Controller('toptex')
export class ToptexController {
  constructor(private readonly toptexService: ToptexService) {}

  @Get('status')
  @GetToptexStatus()
  async getStatus() {
    return this.toptexService.checkStatus();
  }

  @Post('sync')
  @SyncToptex()
  async runSync(@Body() dto: SyncToptexDto) {
    return this.toptexService.runFullSync(dto);
  }
}
