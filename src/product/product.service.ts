import { Injectable } from '@nestjs/common';
import { ProductListHandler } from './handlers/product-list.handler';
import { ProductDetailHandler } from './handlers/product-detail.handler';
import { ProductFiltersHandler } from './handlers/product-filters.handler';
import { ProductSearchHandler } from './handlers/product-search.handler';
import { GetProductsDto } from './dto/get-products.dto';
import { GetProductDetailDto } from './dto/get-product-detail.dto';
import { GetFiltersDto } from './dto/get-filters.dto';
import { SearchProductsDto } from './dto/search-products.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productListHandler: ProductListHandler,
    private readonly productDetailHandler: ProductDetailHandler,
    private readonly productFiltersHandler: ProductFiltersHandler,
    private readonly productSearchHandler: ProductSearchHandler,
  ) {}

  async findAll(dto: GetProductsDto) {
    return this.productListHandler.execute(dto);
  }

  async findOne(catalogReference: string, dto: GetProductDetailDto) {
    return this.productDetailHandler.execute(catalogReference, dto);
  }

  async getFilters(dto: GetFiltersDto) {
    return this.productFiltersHandler.execute(dto);
  }

  async search(dto: SearchProductsDto) {
    return this.productSearchHandler.execute(dto);
  }
}
