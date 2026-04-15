import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository, ReviewWithIncludes } from '../repositories/review.repository';

@Injectable()
export class FindAllByProductHandler {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(productId: string): Promise<ReviewWithIncludes[]> {
    const productExists = await this.reviewRepository.productExists(productId);

    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    return this.reviewRepository.findAllByProduct(productId);
  }
}
