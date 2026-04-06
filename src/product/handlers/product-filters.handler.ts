import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { GetFiltersDto } from '../dto/get-filters.dto';

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

@Injectable()
export class ProductFiltersHandler {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(dto: GetFiltersDto) {
    let targetCategoryId: string | null = null;

    if (dto.categorySlug) {
      const parentCat = await this.productRepo.findCategoryBySlug(
        dto.categorySlug,
      );
      if (!parentCat) {
        throw new BadRequestException('Category slug not found');
      }
      targetCategoryId = parentCat.id;

      if (dto.subCategorySlug) {
        const subCat = await this.productRepo.findCategoryBySlug(
          dto.subCategorySlug,
        );
        if (!subCat) {
          throw new BadRequestException('Subcategory slug not found');
        }
        if (subCat.parentId !== parentCat.id) {
          throw new BadRequestException(
            'Subcategory does not belong to this category',
          );
        }
        targetCategoryId = subCat.id;
      }
    }

    const filters = {
      categoryId: targetCategoryId,
      minPrice: dto.minPrice,
      maxPrice: dto.maxPrice,
      organic: dto.organic,
      recycled: dto.recycled,
      colors: dto.colors,
      sizes: dto.sizes,
      brands: dto.brands,
    };

    const raw = await this.productRepo.getFiltersData(filters, dto.lang);

    const sizes = raw.sizes.slice().sort((a, b) => {
      const idxA = SIZE_ORDER.indexOf(a.label);
      const idxB = SIZE_ORDER.indexOf(b.label);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.label.localeCompare(b.label);
    });

    return {
      colors: raw.colors,
      sizes,
      brands: raw.brands,
      priceRange: raw.priceRange,
    };
  }
}
