import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { GetProductsDto } from '../dto/get-products.dto';
import { getTranslation } from '../../common/utils/translation.util';
import { ProductListRaw } from '../types/product-detail-raw.interface';

@Injectable()
export class ProductListHandler {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(dto: GetProductsDto) {
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

    const { products, total } =
      await this.productRepo.getFilteredProductsPaginated(
        filters,
        dto.sortBy,
        dto.page,
        dto.limit,
      );

    const totalPages = Math.ceil(total / dto.limit);

    const data = products.map((p: ProductListRaw) => {
      let minPrice: number | null = null;
      let activeColorsCount = 0;
      const formattedColors: {
        colorId: string;
        colorCode: string;
        hexColor: string | null;
        colorName: string;
      }[] = [];

      for (const color of p.colors) {
        if (color.skus.length > 0) {
          activeColorsCount++;
          const validPrices = color.skus.map((s) => Number(s.publicPrice));
          const colorMin = Math.min(...validPrices);
          if (minPrice === null || colorMin < minPrice) {
            minPrice = colorMin;
          }

          formattedColors.push({
            colorId: color.id,
            colorCode: color.colorCode,
            hexColor: color.hexColor,
            colorName: getTranslation(
              color.translations,
              dto.lang,
              'colorName',
            ),
          });
        }
      }

      let categoryShape: {
        id: string;
        slug: string;
        name: string;
      } | null = null;
      if (p.categories.length > 0) {
        const firstCat = p.categories[0].category;
        categoryShape = {
          id: firstCat.id,
          slug: firstCat.slug,
          name: getTranslation(firstCat.translations, dto.lang, 'name'),
        };
      }

      return {
        id: p.id,
        catalogReference: p.catalogReference,
        brand: p.brand,
        name: getTranslation(p.translations, dto.lang, 'name'),
        mainImage: p.images?.[0]?.urlImage || null,
        minPrice,
        organic: p.organic,
        recycled: p.recycled,
        colorsCount: activeColorsCount,
        colors: formattedColors,
        category: categoryShape,
      };
    });

    return {
      data,
      pagination: {
        total,
        page: dto.page,
        limit: dto.limit,
        totalPages,
      },
    };
  }
}
