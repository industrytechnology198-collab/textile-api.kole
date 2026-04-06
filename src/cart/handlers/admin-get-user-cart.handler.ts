import { Injectable } from '@nestjs/common';
import { CartRepository } from '../repositories/cart.repository';
import { GetCartHandler } from './get-cart.handler';

@Injectable()
export class AdminGetUserCartHandler {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly getCartHandler: GetCartHandler,
  ) {}

  async execute(userId: string) {
    const cart = await this.cartRepo.findCartByUserId(userId);

    if (!cart) {
      return { items: [], total: 0 };
    }

    return this.getCartHandler.formatCart(cart);
  }
}
