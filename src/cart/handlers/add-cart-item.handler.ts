import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartRepository } from '../repositories/cart.repository';
import { StockService } from 'src/stock/stock.service';
import { AddCartItemDto } from '../dto/add-cart-item.dto';

@Injectable()
export class AddCartItemHandler {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly stockService: StockService,
  ) {}

  async execute(userId: string, dto: AddCartItemDto) {
    const sku = await this.cartRepo.findSkuById(dto.skuId);

    if (!sku) {
      throw new NotFoundException('SKU not found');
    }

    if (sku.saleState !== 'active' || sku.isDiscontinued) {
      throw new BadRequestException('SKU is not available for purchase');
    }

    const inStock = await this.stockService.checkStockAvailability(
      dto.skuId,
      dto.quantity,
    );

    if (!inStock) {
      throw new BadRequestException('Item is out of stock');
    }

    const cart = await this.cartRepo.findOrCreateCart(userId);

    const existingItem = await this.cartRepo.findCartItemBySkuId(
      cart.id,
      dto.skuId,
    );

    if (existingItem) {
      await this.cartRepo.updateCartItemQuantity(
        existingItem.id,
        existingItem.quantity + dto.quantity,
      );
    } else {
      await this.cartRepo.createCartItem(cart.id, dto.skuId, dto.quantity);
    }

    return this.cartRepo.getCartWithItems(cart.id);
  }
}
