import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ToptexOrderService } from './services/toptex-order.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StockModule } from 'src/stock/stock.module';
import { ToptexModule } from 'src/toptex/toptex.module';
import { CreateOrderHandler } from './handlers/create-order.handler';
import { GetOrdersHandler } from './handlers/get-orders.handler';
import { GetOrderHandler } from './handlers/get-order.handler';
import { CancelOrderHandler } from './handlers/cancel-order.handler';
import { AdminGetAllOrdersHandler } from './handlers/admin-get-all-orders.handler';
import { AdminUpdateOrderStatusHandler } from './handlers/admin-update-order-status.handler';
import { AdminForwardOrderHandler } from './handlers/admin-forward-order.handler';
import { AdminGetToptexOrderHandler } from './handlers/admin-get-toptex-order.handler';
import { AdminGetAllToptexOrdersHandler } from './handlers/admin-get-all-toptex-orders.handler';
import { OrderRepository } from './repositories/order.repository';

@Module({
  imports: [
    ToptexModule,
    PrismaModule,
    StockModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    ToptexOrderService,
    CreateOrderHandler,
    GetOrdersHandler,
    GetOrderHandler,
    CancelOrderHandler,
    AdminGetAllOrdersHandler,
    AdminUpdateOrderStatusHandler,
    AdminForwardOrderHandler,
    AdminGetToptexOrderHandler,
    AdminGetAllToptexOrdersHandler,
  ],
  exports: [OrderService],
})
export class OrderModule {}
