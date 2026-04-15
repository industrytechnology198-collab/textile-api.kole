import { Injectable } from '@nestjs/common';
import { ReviewRepository, ReviewWithIncludes } from '../repositories/review.repository';

@Injectable()
export class FindAllReviewsHandler {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  execute(): Promise<ReviewWithIncludes[]> {
    return this.reviewRepository.findAll();
  }
}
