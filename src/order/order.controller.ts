import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/strategies/jwt.strategy';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  GetOrdersQueryDto,
  GetAdminOrdersQueryDto,
  UpdateOrderStatusDto,
  ForwardOrderDto,
} from './dto/order-query.dto';
import { ApiCreateOrder } from './decorators/create-order.decorator';
import { ApiAdminForwardOrder } from './decorators/admin-forward-order.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // User routes
  @Post()
  @ApiCreateOrder()
  createOrder(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(user.userId, dto.testMode);
  }

  @Get()
  getOrders(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetOrdersQueryDto,
  ) {
    return this.orderService.getOrders(user.userId, query);
  }

  // Admin routes - declared before :id to avoid routing conflicts
  @Get('admin/all')
  @Roles(Role.ADMIN)
  adminGetAllOrders(@Query() query: GetAdminOrdersQueryDto) {
    return this.orderService.adminGetAllOrders(query);
  }

  @Get('admin/toptex')
  @Roles(Role.ADMIN)
  adminGetAllToptexOrders() {
    return this.orderService.adminGetAllToptexOrders();
  }

  @Patch('admin/:id/status')
  @Roles(Role.ADMIN)
  adminUpdateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.adminUpdateOrderStatus(id, dto.status);
  }

  @Post('admin/:id/forward')
  @Roles(Role.ADMIN)
  @ApiAdminForwardOrder()
  adminForwardToToptex(
    @Param('id') id: string,
    @Body() dto: ForwardOrderDto,
  ) {
    return this.orderService.adminForwardToToptex(id, dto.testMode);
  }

  @Get('admin/:id/toptex')
  @Roles(Role.ADMIN)
  adminGetToptexOrder(@Param('id') id: string) {
    return this.orderService.adminGetToptexOrder(id);
  }

  // User routes with ID parameter
  @Get(':id')
  getOrder(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.orderService.getOrder(id, user.userId, user.role === Role.ADMIN);
  }

  @Delete(':id')
  cancelOrder(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.orderService.cancelOrder(id, user.userId);
  }
}

