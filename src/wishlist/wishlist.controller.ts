import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/strategies/jwt.strategy';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { MergeWishlistDto } from './dto/merge-wishlist.dto';
import { ApiAddToWishlist } from './decorators/add-to-wishlist.decorator';
import { ApiFindAllWishlist } from './decorators/find-all-wishlist.decorator';
import { ApiRemoveFromWishlist } from './decorators/remove-from-wishlist.decorator';
import { ApiClearWishlist } from './decorators/clear-wishlist.decorator';
import { ApiMergeWishlist } from './decorators/merge-wishlist.decorator';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiAddToWishlist()
  add(@CurrentUser() user: JwtPayload, @Body() dto: AddToWishlistDto) {
    return this.wishlistService.add(user.userId, dto);
  }

  @Get()
  @ApiFindAllWishlist()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.wishlistService.findAll(user.userId);
  }

  // Declare before DELETE /:productId to avoid route conflict
  @Delete('clear')
  @ApiClearWishlist()
  clear(@CurrentUser() user: JwtPayload) {
    return this.wishlistService.clear(user.userId);
  }

  @Delete(':productId')
  @ApiRemoveFromWishlist()
  remove(
    @Param('productId') productId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.wishlistService.remove(user.userId, productId);
  }

  @Post('merge')
  @ApiMergeWishlist()
  merge(@CurrentUser() user: JwtPayload, @Body() dto: MergeWishlistDto) {
    return this.wishlistService.merge(user.userId, dto);
  }
}
