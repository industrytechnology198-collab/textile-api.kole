import { Controller, Get, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Public } from 'src/common/decorators/public.decorator';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { GetCategories } from './decorators/get-categories.decorator';

@Public()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @GetCategories()
  async getCategories(@Query() query: GetCategoriesDto) {
    return this.categoryService.getCategories(query);
  }
}
