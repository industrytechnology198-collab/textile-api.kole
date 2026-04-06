import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from './repositories/cart.repository';
import { AddCartItemHandler } from './handlers/add-cart-item.handler';
import { GetCartHandler } from './handlers/get-cart.handler';
import { UpdateCartItemHandler } from './handlers/update-cart-item.handler';
import { RemoveCartItemHandler } from './handlers/remove-cart-item.handler';
import { ClearCartHandler } from './handlers/clear-cart.handler';
import { MergeCartHandler } from './handlers/merge-cart.handler';
import { AdminGetAllCartsHandler } from './handlers/admin-get-all-carts.handler';
import { AdminGetUserCartHandler } from './handlers/admin-get-user-cart.handler';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StockModule } from 'src/stock/stock.module';

@Module({
  imports: [PrismaModule, StockModule],
  controllers: [CartController],
  providers: [
    CartService,
    CartRepository,
    GetCartHandler,
    AddCartItemHandler,
    UpdateCartItemHandler,
    RemoveCartItemHandler,
    ClearCartHandler,
    MergeCartHandler,
    AdminGetAllCartsHandler,
    AdminGetUserCartHandler,
  ],
})
export class CartModule {}
