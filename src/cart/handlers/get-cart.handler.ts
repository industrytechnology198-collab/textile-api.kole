import { Injectable } from '@nestjs/common';
import { CartRepository } from '../repositories/cart.repository';

@Injectable()
export class GetCartHandler {
  constructor(private readonly cartRepo: CartRepository) {}

  async execute(userId: string) {
    const cart = await this.cartRepo.findCartByUserId(userId);

    if (!cart) {
      return { items: [], total: 0 };
    }

    return this.formatCart(cart);
  }

  formatCart(cart: {
    cartItems: {
      id: string;
      skuId: string;
      quantity: number;
      sku: {
        id: string;
        sizeLabel: string | null;
        price: { toNumber: () => number } | number;
        publicPrice: { toNumber: () => number } | number | null;
        saleState: string;
        isDiscontinued: boolean;
        color: {
          colorCode: string;
          hexColor: string | null;
          packshots: { urlImage: string }[];
          product: {
            id: string;
            catalogReference: string;
            brand: string;
            images: { urlImage: string }[];
          };
        };
      };
    }[];
  }) {
    const items = cart.cartItems.map((item) => ({
      id: item.id,
      skuId: item.skuId,
      quantity: item.quantity,
      sku: {
        sizeLabel: item.sku.sizeLabel,
        price: Number(item.sku.price),
        publicPrice:
          item.sku.publicPrice != null ? Number(item.sku.publicPrice) : null,
        saleState: item.sku.saleState,
        isDiscontinued: item.sku.isDiscontinued,
        color: {
          colorCode: item.sku.color.colorCode,
          hexColor: item.sku.color.hexColor,
        },
        product: {
          id: item.sku.color.product.id,
          catalogReference: item.sku.color.product.catalogReference,
          brand: item.sku.color.product.brand,
        },
        image:
          item.sku.color.packshots[0]?.urlImage ??
          item.sku.color.product.images[0]?.urlImage ??
          null,
      },
    }));

    const total = items.reduce(
      (sum, item) => sum + item.sku.price * item.quantity,
      0,
    );

    return { items, total: Math.round(total * 100) / 100 };
  }
}
