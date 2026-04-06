import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { SearchProductsDto } from '../dto/search-products.dto';
import { getTranslation } from '../../common/utils/translation.util';
import { ProductListRaw } from '../types/product-detail-raw.interface';

@Injectable()
export class ProductSearchHandler {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(dto: SearchProductsDto) {
    const { products, total } = await this.productRepo.searchProducts(
      dto.q,
      dto.lang,
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
          const validPrices = color.skus.map((s) => Number(s.price));
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
