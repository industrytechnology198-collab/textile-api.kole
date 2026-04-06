import { Injectable } from '@nestjs/common';

@Injectable()
export class StockService {
  // TODO: replace with real Toptex stock API call
  async checkStockAvailability(
    _skuId: string,
    _quantity: number,
  ): Promise<boolean> {
    return true;
  }
}
