import { Injectable } from '@nestjs/common';
import { CartRepository } from '../repositories/cart.repository';
import { AdminGetCartsQueryDto } from '../dto/admin-get-carts-query.dto';

@Injectable()
export class AdminGetAllCartsHandler {
  constructor(private readonly cartRepo: CartRepository) {}

  async execute(dto: AdminGetCartsQueryDto) {
    const { carts, total } = await this.cartRepo.findAllCarts(
      dto.page,
      dto.limit,
    );

    const data = carts.map((cart) => {
      const itemCount = cart.cartItems.length;
      const totalValue = cart.cartItems.reduce(
        (sum, item) => sum + Number(item.sku.price) * item.quantity,
        0,
      );

      return {
        cartId: cart.id,
        user: cart.user,
        itemCount,
        totalValue: Math.round(totalValue * 100) / 100,
      };
    });

    return {
      data,
      total,
      page: dto.page,
      limit: dto.limit,
      totalPages: Math.ceil(total / dto.limit),
    };
  }
}
