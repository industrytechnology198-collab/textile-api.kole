import { Injectable } from '@nestjs/common';
import { AddCartItemHandler } from './handlers/add-cart-item.handler';
import { GetCartHandler } from './handlers/get-cart.handler';
import { UpdateCartItemHandler } from './handlers/update-cart-item.handler';
import { RemoveCartItemHandler } from './handlers/remove-cart-item.handler';
import { ClearCartHandler } from './handlers/clear-cart.handler';
import { MergeCartHandler } from './handlers/merge-cart.handler';
import { AdminGetAllCartsHandler } from './handlers/admin-get-all-carts.handler';
import { AdminGetUserCartHandler } from './handlers/admin-get-user-cart.handler';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { MergeCartDto } from './dto/merge-cart.dto';
import { AdminGetCartsQueryDto } from './dto/admin-get-carts-query.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly addCartItemHandler: AddCartItemHandler,
    private readonly getCartHandler: GetCartHandler,
    private readonly updateCartItemHandler: UpdateCartItemHandler,
    private readonly removeCartItemHandler: RemoveCartItemHandler,
    private readonly clearCartHandler: ClearCartHandler,
    private readonly mergeCartHandler: MergeCartHandler,
    private readonly adminGetAllCartsHandler: AdminGetAllCartsHandler,
    private readonly adminGetUserCartHandler: AdminGetUserCartHandler,
  ) {}

  addItem(userId: string, dto: AddCartItemDto) {
    return this.addCartItemHandler.execute(userId, dto);
  }

  getCart(userId: string) {
    return this.getCartHandler.execute(userId);
  }

  updateItem(userId: string, skuId: string, dto: UpdateCartItemDto) {
    return this.updateCartItemHandler.execute(userId, skuId, dto);
  }

  removeItem(userId: string, skuId: string) {
    return this.removeCartItemHandler.execute(userId, skuId);
  }

  clearCart(userId: string) {
    return this.clearCartHandler.execute(userId);
  }

  mergeCart(userId: string, dto: MergeCartDto) {
    return this.mergeCartHandler.execute(userId, dto);
  }

  adminGetAllCarts(dto: AdminGetCartsQueryDto) {
    return this.adminGetAllCartsHandler.execute(dto);
  }

  adminGetUserCart(userId: string) {
    return this.adminGetUserCartHandler.execute(userId);
  }
}
