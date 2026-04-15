import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { WishlistRepository } from './repositories/wishlist.repository';
import { AddToWishlistHandler } from './handlers/add-to-wishlist.handler';
import { FindAllWishlistHandler } from './handlers/find-all-wishlist.handler';
import { RemoveFromWishlistHandler } from './handlers/remove-from-wishlist.handler';
import { ClearWishlistHandler } from './handlers/clear-wishlist.handler';
import { MergeWishlistHandler } from './handlers/merge-wishlist.handler';

@Module({
  imports: [PrismaModule],
  controllers: [WishlistController],
  providers: [
    WishlistService,
    WishlistRepository,
    AddToWishlistHandler,
    FindAllWishlistHandler,
    RemoveFromWishlistHandler,
    ClearWishlistHandler,
    MergeWishlistHandler,
  ],
})
export class WishlistModule {}
