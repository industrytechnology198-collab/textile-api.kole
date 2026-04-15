import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddToWishlistDto } from '../dto/add-to-wishlist.dto';
import {
  WishlistItemWithProduct,
  WishlistRepository,
} from '../repositories/wishlist.repository';

@Injectable()
export class AddToWishlistHandler {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  async execute(
    userId: string,
    dto: AddToWishlistDto,
  ): Promise<WishlistItemWithProduct> {
    const productExists = await this.wishlistRepository.productExists(
      dto.productId,
    );

    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.wishlistRepository.findByUserAndProduct(
      userId,
      dto.productId,
    );

    if (existing) {
      throw new ConflictException('Product already in wishlist');
    }

    return this.wishlistRepository.create(userId, dto.productId);
  }
}
