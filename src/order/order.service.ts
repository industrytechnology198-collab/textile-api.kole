import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import {
  GetOrdersQueryDto,
  GetAdminOrdersQueryDto,
} from './dto/order-query.dto';
import { GetOrdersHandler } from './handlers/get-orders.handler';
import { AdminGetAllOrdersHandler } from './handlers/admin-get-all-orders.handler';
import { AdminForwardOrderHandler } from './handlers/admin-forward-order.handler';
import { AdminGetToptexOrderHandler } from './handlers/admin-get-toptex-order.handler';
import { CreateOrderHandler } from './handlers/create-order.handler';
import { GetOrderHandler } from './handlers/get-order.handler';
import { CancelOrderHandler } from './handlers/cancel-order.handler';
import { AdminUpdateOrderStatusHandler } from './handlers/admin-update-order-status.handler';
import { AdminGetAllToptexOrdersHandler } from './handlers/admin-get-all-toptex-orders.handler';

@Injectable()
export class OrderService {
  constructor(
    private readonly createOrderHandler: CreateOrderHandler,
    private readonly getOrdersHandler: GetOrdersHandler,
    private readonly getOrderHandler: GetOrderHandler,
    private readonly cancelOrderHandler: CancelOrderHandler,
    private readonly adminGetAllOrdersHandler: AdminGetAllOrdersHandler,
    private readonly adminUpdateOrderStatusHandler: AdminUpdateOrderStatusHandler,
    private readonly adminForwardOrderHandler: AdminForwardOrderHandler,
    private readonly adminGetToptexOrderHandler: AdminGetToptexOrderHandler,
    private readonly adminGetAllToptexOrdersHandler: AdminGetAllToptexOrdersHandler,
  ) {}

  createOrder(userId: string, testMode: boolean) {
    return this.createOrderHandler.execute(userId, testMode);
  }

  getOrders(userId: string, query: GetOrdersQueryDto) {
    return this.getOrdersHandler.execute(userId, query);
  }

  getOrder(id: string, userId: string, isAdmin = false) {
    return this.getOrderHandler.execute(id, userId, isAdmin);
  }

  cancelOrder(id: string, userId: string) {
    return this.cancelOrderHandler.execute(id, userId);
  }

  adminGetAllOrders(query: GetAdminOrdersQueryDto) {
    return this.adminGetAllOrdersHandler.execute(query);
  }

  adminUpdateOrderStatus(id: string, status: OrderStatus) {
    return this.adminUpdateOrderStatusHandler.execute(id, status);
  }

  adminForwardToToptex(id: string, testMode: boolean) {
    return this.adminForwardOrderHandler.execute(id, testMode);
  }

  adminGetToptexOrder(id: string) {
    return this.adminGetToptexOrderHandler.execute(id);
  }

  adminGetAllToptexOrders() {
    return this.adminGetAllToptexOrdersHandler.execute();
  }
}
