import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductListHandler } from './handlers/product-list.handler';
import { ProductDetailHandler } from './handlers/product-detail.handler';
import { ProductFiltersHandler } from './handlers/product-filters.handler';
import { ProductSearchHandler } from './handlers/product-search.handler';
import { ProductRepository } from './repositories/product.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductListHandler,
    ProductDetailHandler,
    ProductFiltersHandler,
    ProductSearchHandler,
    ProductRepository,
  ],
})
export class ProductModule {}
