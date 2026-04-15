import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddToWishlistDto {
  @IsUUID()
  @IsNotEmpty()
  productId!: string;
}
