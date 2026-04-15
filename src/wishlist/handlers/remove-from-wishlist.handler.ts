import { Injectable, NotFoundException } from '@nestjs/common';
import { WishlistRepository } from '../repositories/wishlist.repository';

@Injectable()
export class RemoveFromWishlistHandler {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  async execute(
    userId: string,
    productId: string,
  ): Promise<{ message: string }> {
    const existing = await this.wishlistRepository.findByUserAndProduct(
      userId,
      productId,
    );

    if (!existing) {
      throw new NotFoundException('Product not found in wishlist');
    }

    await this.wishlistRepository.delete(userId, productId);

    return { message: 'Product removed from wishlist' };
  }
}
