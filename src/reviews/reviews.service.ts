import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewHandler } from './handlers/create-review.handler';
import { FindAllByProductHandler } from './handlers/find-all-by-product.handler';
import { FindAllReviewsHandler } from './handlers/find-all-reviews.handler';
import { UpdateReviewHandler } from './handlers/update-review.handler';
import { RemoveReviewHandler } from './handlers/remove-review.handler';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly createReviewHandler: CreateReviewHandler,
    private readonly findAllByProductHandler: FindAllByProductHandler,
    private readonly findAllReviewsHandler: FindAllReviewsHandler,
    private readonly updateReviewHandler: UpdateReviewHandler,
    private readonly removeReviewHandler: RemoveReviewHandler,
  ) {}

  create(userId: string, dto: CreateReviewDto) {
    return this.createReviewHandler.execute(userId, dto);
  }

  findAllByProduct(productId: string) {
    return this.findAllByProductHandler.execute(productId);
  }

  findAll() {
    return this.findAllReviewsHandler.execute();
  }

  update(id: string, userId: string, dto: UpdateReviewDto) {
    return this.updateReviewHandler.execute(id, userId, dto);
  }

  remove(id: string, userId: string, role: Role) {
    return this.removeReviewHandler.execute(id, userId, role);
  }
}
