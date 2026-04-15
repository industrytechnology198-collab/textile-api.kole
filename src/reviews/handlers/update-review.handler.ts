import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { ReviewRepository, ReviewWithIncludes } from '../repositories/review.repository';

@Injectable()
export class UpdateReviewHandler {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(
    id: string,
    userId: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewWithIncludes> {
    const review = await this.reviewRepository.findById(id);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    return this.reviewRepository.update(id, {
      rating: dto.rating,
      comment: dto.comment,
    });
  }
}
