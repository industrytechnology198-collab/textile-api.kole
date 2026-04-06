import { Injectable } from '@nestjs/common';
import { CategoryTreeHandler } from './handlers/category-tree.handler';
import { GetCategoriesDto } from './dto/get-categories.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly treeHandler: CategoryTreeHandler) {}

  async getCategories(dto: GetCategoriesDto) {
    return this.treeHandler.execute(dto);
  }
}
