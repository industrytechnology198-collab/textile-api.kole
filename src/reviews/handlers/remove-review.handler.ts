import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ReviewRepository } from '../repositories/review.repository';

@Injectable()
export class RemoveReviewHandler {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(
    id: string,
    userId: string,
    role: Role,
  ): Promise<{ message: string }> {
    const review = await this.reviewRepository.findById(id);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (role !== Role.ADMIN && review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepository.delete(id);

    return { message: 'Review deleted successfully' };
  }
}
