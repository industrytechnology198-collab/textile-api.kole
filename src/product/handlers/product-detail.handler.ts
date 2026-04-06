import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { GetProductDetailDto } from '../dto/get-product-detail.dto';
import { getTranslation } from '../../common/utils/translation.util';
import {
  ProductDetailRaw,
  ProductColorRaw,
  ProductImageRaw,
} from '../types/product-detail-raw.interface';

@Injectable()
export class ProductDetailHandler {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(catalogReference: string, dto: GetProductDetailDto) {
    const p = (await this.productRepo.getProductDetail(
      catalogReference,
    )) as ProductDetailRaw | null;

    if (!p) {
      throw new NotFoundException(
        `Product ${catalogReference} not found or inactive`,
      );
    }

    let categoryShape: { id: string; slug: string; name: string } | null = null;
    if (p.categories && p.categories.length > 0) {
      // Typically pick the first bound category
      const firstCat = p.categories[0].category;
      categoryShape = {
        id: firstCat.id,
        slug: firstCat.slug,
        name: getTranslation(firstCat.translations, dto.lang, 'name'),
      };
    }

    const formattedColors = p.colors.map((color: ProductColorRaw) => {
      const skus = color.skus.map((s) => ({
        id: s.id,
        sku: s.sku,
        ean: s.ean,
        sizeLabel: s.sizeLabel,
        price: Number(s.price),
        publicPrice: s.publicPrice ? Number(s.publicPrice) : null,
        isNew: s.isNew,
        isDiscontinued: s.isDiscontinued,
      }));

      const packshots = color.packshots.map((ps) => ({
        id: ps.id,
        angleName: ps.angleName,
        urlImage: ps.urlImage,
      }));

      return {
        id: color.id,
        colorCode: color.colorCode,
        hexColor: color.hexColor,
        colorName: getTranslation(color.translations, dto.lang, 'colorName'),
        pantone: color.pantone,
        packshots,
        skus,
      };
    });

    const formattedImages = p.images.map((img: ProductImageRaw) => ({
      id: img.id,
      urlImage: img.urlImage,
      isMain: img.isMain,
    }));

    return {
      id: p.id,
      catalogReference: p.catalogReference,
      brand: p.brand,
      name: getTranslation(p.translations, dto.lang, 'name'),
      description: getTranslation(p.translations, dto.lang, 'description'),
      composition: getTranslation(p.translations, dto.lang, 'composition'),
      weight: p.weight,
      gender: p.gender,
      labelType: p.labelType,
      organic: p.organic,
      recycled: p.recycled,
      vegan: p.vegan,
      saleState: p.saleState,
      images: formattedImages,
      colors: formattedColors,
      category: categoryShape,
    };
  }
}
