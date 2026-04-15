import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ReviewRepository, ReviewWithIncludes } from '../repositories/review.repository';

@Injectable()
export class CreateReviewHandler {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(
    userId: string,
    dto: CreateReviewDto,
  ): Promise<ReviewWithIncludes> {
    const existing = await this.reviewRepository.findByUserAndProduct(
      userId,
      dto.productId,
    );

    if (existing) {
      throw new ConflictException('You have already reviewed this product');
    }

    const productExists = await this.reviewRepository.productExists(
      dto.productId,
    );

    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    return this.reviewRepository.create({
      userId,
      productId: dto.productId,
      rating: dto.rating,
      comment: dto.comment,
    });
  }
}
