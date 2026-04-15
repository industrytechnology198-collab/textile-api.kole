import { Injectable } from '@nestjs/common';
import {
  WishlistWithProduct,
  WishlistRepository,
} from '../repositories/wishlist.repository';

@Injectable()
export class FindAllWishlistHandler {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  execute(userId: string): Promise<WishlistWithProduct[]> {
    return this.wishlistRepository.findAllByUser(userId);
  }
}
