import { Injectable } from '@nestjs/common';
import { CartRepository } from '../repositories/cart.repository';
import { StockService } from 'src/stock/stock.service';
import { MergeCartDto } from '../dto/merge-cart.dto';
import { GetCartHandler } from './get-cart.handler';

@Injectable()
export class MergeCartHandler {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly stockService: StockService,
    private readonly getCartHandler: GetCartHandler,
  ) {}

  async execute(userId: string, dto: MergeCartDto) {
    const cart = await this.cartRepo.findOrCreateCart(userId);

    for (const item of dto.items) {
      try {
        const sku = await this.cartRepo.findSkuById(item.skuId);

        if (!sku) continue;
        if (sku.saleState !== 'active' || sku.isDiscontinued) continue;

        const inStock = await this.stockService.checkStockAvailability(
          item.skuId,
          item.quantity,
        );

        if (!inStock) continue;

        const existingItem = await this.cartRepo.findCartItemBySkuId(
          cart.id,
          item.skuId,
        );

        if (existingItem) {
          await this.cartRepo.updateCartItemQuantity(
            existingItem.id,
            existingItem.quantity + item.quantity,
          );
        } else {
          await this.cartRepo.createCartItem(
            cart.id,
            item.skuId,
            item.quantity,
          );
        }
      } catch {
        // Skip invalid items silently
      }
    }

    const updatedCart = await this.cartRepo.getCartWithItems(cart.id);

    return this.getCartHandler.formatCart(updatedCart!);
  }
}
