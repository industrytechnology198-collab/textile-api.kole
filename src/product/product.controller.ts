import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Public } from 'src/common/decorators/public.decorator';
import { GetProductsDto } from './dto/get-products.dto';
import { GetProductDetailDto } from './dto/get-product-detail.dto';
import { GetFiltersDto } from './dto/get-filters.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { GetProducts } from './decorators/get-products.decorator';
import { GetProductDetail } from './decorators/get-product-detail.decorator';
import { GetFilters } from './decorators/get-filters.decorator';
import { GetProductSearch } from './decorators/get-product-search.decorator';

@Public()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @GetProducts()
  async getProducts(@Query() query: GetProductsDto) {
    return this.productService.findAll(query);
  }

  @Get('filters')
  @GetFilters()
  async getFilters(@Query() query: GetFiltersDto) {
    return this.productService.getFilters(query);
  }

  @Get('search')
  @GetProductSearch()
  async searchProducts(@Query() query: SearchProductsDto) {
    return this.productService.search(query);
  }

  @Get(':catalogReference')
  @GetProductDetail()
  async getProductDetail(
    @Param('catalogReference') catalogReference: string,
    @Query() query: GetProductDetailDto,
  ) {
    return this.productService.findOne(catalogReference, query);
  }
}
