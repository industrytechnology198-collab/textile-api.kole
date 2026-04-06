import { Injectable } from '@nestjs/common';
import { CartRepository } from '../repositories/cart.repository';

@Injectable()
export class ClearCartHandler {
  constructor(private readonly cartRepo: CartRepository) {}

  async execute(userId: string) {
    const cart = await this.cartRepo.findOrCreateCart(userId);

    await this.cartRepo.clearCartItems(cart.id);

    return { message: 'Cart cleared successfully' };
  }
}
