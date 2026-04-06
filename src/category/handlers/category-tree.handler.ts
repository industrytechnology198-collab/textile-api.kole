import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { GetCategoriesDto } from '../dto/get-categories.dto';
import { getTranslation } from '../../common/utils/translation.util';
import { CategoryWithChildren } from '../types/category-detail-raw.interface';

@Injectable()
export class CategoryTreeHandler {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async execute(dto: GetCategoriesDto) {
    const rawCategories: CategoryWithChildren[] =
      await this.categoryRepo.getTopLevelCategoriesWithActiveProducts();

    return rawCategories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: getTranslation(cat.translations, dto.lang, 'name'),
      subcategories: (cat.children || []).map((child) => ({
        id: child.id,
        slug: child.slug,
        name: getTranslation(child.translations, dto.lang, 'name'),
      })),
    }));
  }
}
