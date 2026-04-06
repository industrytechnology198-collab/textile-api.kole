import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/strategies/jwt.strategy';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { MergeCartDto } from './dto/merge-cart.dto';
import { AdminGetCartsQueryDto } from './dto/admin-get-carts-query.dto';
import { ApiAddCartItem } from './decorators/add-cart-item.decorator';
import { ApiGetCart } from './decorators/get-cart.decorator';
import { ApiUpdateCartItem } from './decorators/update-cart-item.decorator';
import { ApiRemoveCartItem } from './decorators/remove-cart-item.decorator';
import { ApiClearCart } from './decorators/clear-cart.decorator';
import { ApiMergeCart } from './decorators/merge-cart.decorator';
import { ApiAdminGetAllCarts } from './decorators/admin-get-all-carts.decorator';
import { ApiAdminGetUserCart } from './decorators/admin-get-user-cart.decorator';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  @ApiAddCartItem()
  addItem(@CurrentUser() user: JwtPayload, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(user.userId, dto);
  }

  @Get()
  @ApiGetCart()
  getCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.getCart(user.userId);
  }

  @Post('merge')
  @ApiMergeCart()
  mergeCart(@CurrentUser() user: JwtPayload, @Body() dto: MergeCartDto) {
    return this.cartService.mergeCart(user.userId, dto);
  }

  // Admin routes declared before :skuId routes to avoid routing conflicts
  @Get('admin/all')
  @Roles(Role.ADMIN)
  @ApiAdminGetAllCarts()
  adminGetAllCarts(@Query() query: AdminGetCartsQueryDto) {
    return this.cartService.adminGetAllCarts(query);
  }

  @Get('admin/:userId')
  @Roles(Role.ADMIN)
  @ApiAdminGetUserCart()
  adminGetUserCart(@Param('userId') userId: string) {
    return this.cartService.adminGetUserCart(userId);
  }

  @Patch('items/:skuId')
  @ApiUpdateCartItem()
  updateItem(
    @CurrentUser() user: JwtPayload,
    @Param('skuId') skuId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(user.userId, skuId, dto);
  }

  @Delete('items/:skuId')
  @ApiRemoveCartItem()
  removeItem(@CurrentUser() user: JwtPayload, @Param('skuId') skuId: string) {
    return this.cartService.removeItem(user.userId, skuId);
  }

  @Delete()
  @ApiClearCart()
  clearCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.clearCart(user.userId);
  }
}
