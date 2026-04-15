import { Injectable } from '@nestjs/common';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { MergeWishlistDto } from './dto/merge-wishlist.dto';
import { AddToWishlistHandler } from './handlers/add-to-wishlist.handler';
import { FindAllWishlistHandler } from './handlers/find-all-wishlist.handler';
import { RemoveFromWishlistHandler } from './handlers/remove-from-wishlist.handler';
import { ClearWishlistHandler } from './handlers/clear-wishlist.handler';
import { MergeWishlistHandler } from './handlers/merge-wishlist.handler';

@Injectable()
export class WishlistService {
  constructor(
    private readonly addToWishlistHandler: AddToWishlistHandler,
    private readonly findAllWishlistHandler: FindAllWishlistHandler,
    private readonly removeFromWishlistHandler: RemoveFromWishlistHandler,
    private readonly clearWishlistHandler: ClearWishlistHandler,
    private readonly mergeWishlistHandler: MergeWishlistHandler,
  ) {}

  add(userId: string, dto: AddToWishlistDto) {
    return this.addToWishlistHandler.execute(userId, dto);
  }

  findAll(userId: string) {
    return this.findAllWishlistHandler.execute(userId);
  }

  remove(userId: string, productId: string) {
    return this.removeFromWishlistHandler.execute(userId, productId);
  }

  clear(userId: string) {
    return this.clearWishlistHandler.execute(userId);
  }

  merge(userId: string, dto: MergeWishlistDto) {
    return this.mergeWishlistHandler.execute(userId, dto);
  }
}
