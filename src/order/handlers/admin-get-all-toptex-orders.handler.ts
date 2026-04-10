import { Injectable } from '@nestjs/common';
import { ToptexOrderService } from '../services/toptex-order.service';

@Injectable()
export class AdminGetAllToptexOrdersHandler {
  constructor(private readonly toptexOrderService: ToptexOrderService) {}

  execute() {
    return this.toptexOrderService.getAllOrders();
  }
}
