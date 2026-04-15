import { Injectable } from '@nestjs/common';
import { WishlistRepository } from '../repositories/wishlist.repository';

@Injectable()
export class ClearWishlistHandler {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  async execute(userId: string): Promise<{ message: string }> {
    await this.wishlistRepository.deleteAllByUser(userId);

    return { message: 'Wishlist cleared' };
  }
}
