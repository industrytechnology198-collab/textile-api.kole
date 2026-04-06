import { Prisma } from '@prisma/client';

export interface TranslationRaw {
  id: string;
  entityId: string;
  entityType: string;
  langCode: string;
  field: string;
  value: string;
}

export interface ProductSkuRaw {
  id: string;
  colorId: string;
  sku: string;
  ean: string | null;
  barCode: string | null;
  sizeLabel: string | null;
  sizeCode: string | null;
  price: Prisma.Decimal;
  publicPrice: Prisma.Decimal | null;
  unitsPerBox: number | null;
  unitsPerPack: number | null;
  isNew: boolean;
  isDiscontinued: boolean;
  saleState: string;
}

export interface ColorPackshotRaw {
  id: string;
  colorId: string;
  imageId: number | null;
  angleName: string;
  urlImage: string;
  urlAuthenticated: string | null;
  lastUpdate: Date | null;
}

export interface ProductColorRaw {
  id: string;
  productId: string;
  colorCode: string;
  hexColor: string | null;
  pantone: string | null;
  rgb: string | null;
  cmyk: string | null;
  saleState: string;
  lastChange: Date | null;
  packshots: ColorPackshotRaw[];
  skus: ProductSkuRaw[];
  translations: TranslationRaw[];
}

export interface CategoryRaw {
  id: string;
  parentId: string | null;
  slug: string;
  translations: TranslationRaw[];
}

export interface ProductCategoryRaw {
  productId: string;
  categoryId: string;
  category: CategoryRaw;
}

export interface ProductImageRaw {
  id: string;
  productId: string;
  imageId: number | null;
  urlImage: string;
  urlAuthenticated: string | null;
  isMain: boolean;
  lastUpdate: Date | null;
}

export interface ProductDetailRaw {
  id: string;
  catalogReference: string;
  brand: string;
  weight: string | null;
  gender: string | null;
  labelType: string | null;
  organic: boolean;
  recycled: boolean;
  vegan: boolean;
  oekoTex: boolean;
  saleState: string;
  lastChange: Date | null;
  toptexCreatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  images: ProductImageRaw[];
  categories: ProductCategoryRaw[];
  colors: ProductColorRaw[];
  translations: TranslationRaw[];
}

export interface ProductColorListRaw {
  id: string;
  productId: string;
  colorCode: string;
  hexColor: string | null;
  pantone: string | null;
  saleState: string;
  skus: ProductSkuRaw[];
  translations: TranslationRaw[];
}

export interface ProductListRaw {
  id: string;
  catalogReference: string;
  brand: string;
  organic: boolean;
  recycled: boolean;
  saleState: string;
  images: ProductImageRaw[];
  categories: ProductCategoryRaw[];
  colors: ProductColorListRaw[];
  translations: TranslationRaw[];
}
