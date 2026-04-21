import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository, ReviewWithIncludes } from '../repositories/review.repository';
import { SetReviewVisibilityDto } from '../dto/set-review-visibility.dto';

@Injectable()
export class SetReviewVisibilityHandler {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(id: string, dto: SetReviewVisibilityDto): Promise<ReviewWithIncludes> {
    const review = await this.reviewRepository.findById(id);

    if (!review) {
      throw new NotFoundException('Review not found.');
    }

    return this.reviewRepository.setVisibility(id, dto.isVisible);
  }
}
