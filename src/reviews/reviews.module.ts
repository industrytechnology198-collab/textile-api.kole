import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewRepository } from './repositories/review.repository';
import { CreateReviewHandler } from './handlers/create-review.handler';
import { FindAllByProductHandler } from './handlers/find-all-by-product.handler';
import { FindAllReviewsHandler } from './handlers/find-all-reviews.handler';
import { UpdateReviewHandler } from './handlers/update-review.handler';
import { RemoveReviewHandler } from './handlers/remove-review.handler';
import { SetReviewVisibilityHandler } from './handlers/set-review-visibility.handler';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    ReviewRepository,
    CreateReviewHandler,
    FindAllByProductHandler,
    FindAllReviewsHandler,
    UpdateReviewHandler,
    RemoveReviewHandler,
    SetReviewVisibilityHandler,
  ],
})
export class ReviewsModule {}
