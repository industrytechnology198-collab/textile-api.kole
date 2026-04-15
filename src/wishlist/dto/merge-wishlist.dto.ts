import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class MergeWishlistDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  productIds!: string[];
}
