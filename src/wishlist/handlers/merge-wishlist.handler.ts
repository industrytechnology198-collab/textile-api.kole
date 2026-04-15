import { Injectable } from '@nestjs/common';
import { MergeWishlistDto } from '../dto/merge-wishlist.dto';
import { WishlistRepository } from '../repositories/wishlist.repository';

@Injectable()
export class MergeWishlistHandler {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  async execute(
    userId: string,
    dto: MergeWishlistDto,
  ): Promise<{ message: string }> {
    await this.wishlistRepository.createMany(userId, dto.productIds);

    return { message: 'Wishlist merged successfully' };
  }
}
