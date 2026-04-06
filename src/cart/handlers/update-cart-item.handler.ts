import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartRepository } from '../repositories/cart.repository';
import { StockService } from 'src/stock/stock.service';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { GetCartHandler } from './get-cart.handler';

@Injectable()
export class UpdateCartItemHandler {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly stockService: StockService,
    private readonly getCartHandler: GetCartHandler,
  ) {}

  async execute(userId: string, skuId: string, dto: UpdateCartItemDto) {
    const cart = await this.cartRepo.findCartByUserId(userId);

    if (!cart) {
      throw new NotFoundException('Cart item not found');
    }

    const cartItem = await this.cartRepo.findCartItemBySkuId(cart.id, skuId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const inStock = await this.stockService.checkStockAvailability(
      skuId,
      dto.quantity,
    );

    if (!inStock) {
      throw new BadRequestException('Item is out of stock');
    }

    await this.cartRepo.updateCartItemQuantity(cartItem.id, dto.quantity);

    const updatedCart = await this.cartRepo.getCartWithItems(cart.id);

    return this.getCartHandler.formatCart(updatedCart!);
  }
}
