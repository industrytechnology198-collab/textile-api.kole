import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from '../repositories/cart.repository';
import { GetCartHandler } from './get-cart.handler';

@Injectable()
export class RemoveCartItemHandler {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly getCartHandler: GetCartHandler,
  ) {}

  async execute(userId: string, skuId: string) {
    const cart = await this.cartRepo.findCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException('Cart item not found');
    }

    const cartItem = await this.cartRepo.findCartItemBySkuId(cart.id, skuId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartRepo.deleteCartItem(cartItem.id);

    const updatedCart = await this.cartRepo.getCartWithItems(cart.id);

    return this.getCartHandler.formatCart(updatedCart!);
  }
}
