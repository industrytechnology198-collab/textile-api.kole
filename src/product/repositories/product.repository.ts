import { Injectable } from '@nestjs/common';
import { Prisma, Translation } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryBase } from 'src/category/types/category-detail-raw.interface';
import { ProductListRaw } from '../types/product-detail-raw.interface';

export interface ProductFilters {
  categoryIds: string[];
  minPrice?: number;
  maxPrice?: number;
  organic?: boolean;
  recycled?: boolean;
  colors?: string[];
  sizes?: string[];
  brands?: string[];
  /** Pre-computed IDs from a search query — scopes all filter aggregations */
  searchIds?: string[];
}

interface RawSortResult {
  id: string;
}

interface RawCountResult {
  count: bigint;
}

interface AttachableCategory {
  categoryId: string;
  category: { translations?: Translation[] };
}

interface AttachableColor {
  id: string;
  translations?: Translation[];
}

interface AttachableProduct {
  id: string;
  translations?: Translation[];
  categories: AttachableCategory[];
  colors: AttachableColor[];
}

type ProductListItem = Prisma.ProductGetPayload<{
  include: {
    images: true;
    categories: { include: { category: true } };
    colors: { include: { skus: true } };
  };
}>;

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCategoryBySlug(slug: string) {
    const category: CategoryBase | null = await this.prisma.category.findUnique(
      {
        where: { slug },
      },
    );

    if (category) {
      const translations = await this.prisma.translation.findMany({
        where: { entityId: category.id },
      });
      category.translations = translations;
    }

    return category;
  }

  async findChildCategoryIds(parentId: string): Promise<string[]> {
    const children = await this.prisma.category.findMany({
      where: { parentId },
      select: { id: true },
    });
    return children.map((c) => c.id);
  }

  async getFilteredProductsPaginated(
    filters: ProductFilters,
    sortBy: string,
    page: number,
    limit: number,
  ) {
    const whereClause = this.buildProductWhereInput(filters);
    let productIds: string[] | null = null;
    let total = 0;

    if (sortBy === 'price_asc' || sortBy === 'price_desc') {
      const sortDir =
        sortBy === 'price_asc' ? Prisma.sql`ASC` : Prisma.sql`DESC`;
      const offset = (page - 1) * limit;

      const baseConditions: Prisma.Sql[] = [
        Prisma.sql`p."saleState" = 'active'`,
      ];
      if (filters.organic !== undefined)
        baseConditions.push(Prisma.sql`p."organic" = ${filters.organic}`);
      if (filters.recycled !== undefined)
        baseConditions.push(Prisma.sql`p."recycled" = ${filters.recycled}`);
      if (filters.brands && filters.brands.length > 0)
        baseConditions.push(
          Prisma.sql`p."brand" IN (${Prisma.join(filters.brands)})`,
        );

      const wherePart = baseConditions.reduce(
        (acc, cond) => Prisma.sql`${acc} AND ${cond}`,
      );

      const skuParts: Prisma.Sql[] = [
        Prisma.sql`s."saleState" = 'active'`,
        Prisma.sql`s."isDiscontinued" = false`,
      ];
      if (filters.minPrice !== undefined)
        skuParts.push(Prisma.sql`s."publicPrice" >= ${filters.minPrice}`);
      if (filters.maxPrice !== undefined)
        skuParts.push(Prisma.sql`s."publicPrice" <= ${filters.maxPrice}`);
      const skuFilter = skuParts.reduce(
        (acc, p) => Prisma.sql`${acc} AND ${p}`,
      );

      const catJoin =
        filters.categoryIds && filters.categoryIds.length > 0
          ? Prisma.sql`INNER JOIN "ProductCategory" _cat ON _cat."productId" = p."id" AND _cat."categoryId" IN (${Prisma.join(filters.categoryIds)})`
          : Prisma.empty;

      const colorsExists =
        filters.colors && filters.colors.length > 0
          ? Prisma.sql`AND EXISTS (
              SELECT 1 FROM "ProductColor" _c2
              WHERE _c2."productId" = p."id" AND _c2."saleState" = 'active'
              AND _c2."colorCode" IN (${Prisma.join(filters.colors)})
            )`
          : Prisma.empty;

      const sizesExists =
        filters.sizes && filters.sizes.length > 0
          ? Prisma.sql`AND EXISTS (
              SELECT 1 FROM "ProductColor" _sc
              INNER JOIN "ProductSku" _ss
                ON _ss."colorId" = _sc."id"
                AND _ss."saleState" = 'active'
                AND _ss."isDiscontinued" = false
                AND _ss."sizeLabel" IN (${Prisma.join(filters.sizes)})
              WHERE _sc."productId" = p."id" AND _sc."saleState" = 'active'
            )`
          : Prisma.empty;

      const searchIdsFilter =
        filters.searchIds && filters.searchIds.length > 0
          ? Prisma.sql`AND p."id" IN (${Prisma.join(filters.searchIds)})`
          : Prisma.empty;

      const sortRows = await this.prisma.$queryRaw<RawSortResult[]>`
        SELECT p."id", MIN(s."publicPrice") as "minSortPrice"
        FROM "Product" p
        INNER JOIN "ProductColor" c ON c."productId" = p."id" AND c."saleState" = 'active'
        INNER JOIN "ProductSku" s ON s."colorId" = c."id" AND ${skuFilter}
        ${catJoin}
        WHERE ${wherePart}
        ${colorsExists}
        ${sizesExists}
        ${searchIdsFilter}
        GROUP BY p."id"
        ORDER BY "minSortPrice" ${sortDir}
        OFFSET ${offset}
        LIMIT ${limit}
      `;

      productIds = sortRows.map((r) => r.id);

      const countRows = await this.prisma.$queryRaw<RawCountResult[]>`
        SELECT COUNT(DISTINCT p."id") as "count"
        FROM "Product" p
        INNER JOIN "ProductColor" c ON c."productId" = p."id" AND c."saleState" = 'active'
        INNER JOIN "ProductSku" s ON s."colorId" = c."id" AND ${skuFilter}
        ${catJoin}
        WHERE ${wherePart}
        ${colorsExists}
        ${sizesExists}
        ${searchIdsFilter}
      `;

      total = Number(countRows[0].count);
    } else {
      total = await this.prisma.product.count({ where: whereClause });
    }

    if (productIds !== null && productIds.length === 0) {
      return { products: [], total };
    }

    let finalProducts: ProductListItem[];

    if (productIds !== null) {
      finalProducts = await this.fetchProductsWithDetails(productIds, true);
    } else {
      finalProducts = await this.prisma.product.findMany({
        where: whereClause,
        orderBy: { lastChange: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { where: { isMain: true }, take: 1 },
          categories: { include: { category: true } },
          colors: {
            where: { saleState: 'active' },
            include: {
              skus: { where: { saleState: 'active', isDiscontinued: false } },
            },
          },
        },
      });
    }

    await this.attachTranslations(finalProducts as AttachableProduct[]);
    return { products: finalProducts as unknown as ProductListRaw[], total };
  }

  // ─── filters aggregation ──────────────────────────────────────────────────

  async getFiltersData(filters: ProductFilters, lang: string, q?: string) {
    let base = filters;

    if (q) {
      const searchIds = await this.getProductIdsMatchingSearch(q, lang);
      if (searchIds.length === 0) {
        return {
          colors: [],
          sizes: [],
          brands: [],
          priceRange: { min: null, max: null },
        };
      }
      base = { ...filters, searchIds };
    }

    const priceBaseIds = await this.getProductIds(base);

    const [colors, sizes, brands, priceRange] = await Promise.all([
      this.getColorCounts(priceBaseIds, lang, base.colors),
      this.getSizeCounts(priceBaseIds, base.sizes),
      this.getBrandCounts(priceBaseIds),
      this.computePriceRange(priceBaseIds),
    ]);

    return { colors, sizes, brands, priceRange };
  }

  async getProductIdsMatchingSearch(
    q: string,
    lang: string,
  ): Promise<string[]> {
    const partial = `%${q}%`;
    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT DISTINCT p."id"
      FROM "Product" p
      LEFT JOIN "Translation" tn
        ON tn."entityId" = p."id"
        AND tn."entityType" = 'product' AND tn."field" = 'name'
        AND tn."langCode" = ${lang}
      LEFT JOIN "Translation" tn_en
        ON tn_en."entityId" = p."id"
        AND tn_en."entityType" = 'product' AND tn_en."field" = 'name'
        AND tn_en."langCode" = 'en'
      LEFT JOIN "Translation" td
        ON td."entityId" = p."id"
        AND td."entityType" = 'product' AND td."field" = 'description'
        AND td."langCode" = ${lang}
      LEFT JOIN "Translation" td_en
        ON td_en."entityId" = p."id"
        AND td_en."entityType" = 'product' AND td_en."field" = 'description'
        AND td_en."langCode" = 'en'
      LEFT JOIN "ProductColor" spc
        ON spc."productId" = p."id" AND spc."saleState" = 'active'
      LEFT JOIN "Translation" tc
        ON tc."entityId" = spc."id"
        AND tc."entityType" = 'color' AND tc."field" = 'colorName'
        AND tc."langCode" = ${lang}
      LEFT JOIN "Translation" tc_en
        ON tc_en."entityId" = spc."id"
        AND tc_en."entityType" = 'color' AND tc_en."field" = 'colorName'
        AND tc_en."langCode" = 'en'
      WHERE p."saleState" = 'active'
        AND (
          COALESCE(tn."value", tn_en."value") ILIKE ${partial}
          OR COALESCE(td."value", td_en."value") ILIKE ${partial}
          OR COALESCE(tc."value", tc_en."value") ILIKE ${partial}
          OR p."brand" ILIKE ${partial}
          OR p."catalogReference" ILIKE ${partial}
        )
    `;
    return rows.map((r) => r.id);
  }

  private async getProductIds(filters: ProductFilters): Promise<string[]> {
    const rows = await this.prisma.product.findMany({
      where: this.buildProductWhereInput(filters),
      select: { id: true },
    });
    return rows.map((r) => r.id);
  }

  private async getColorCounts(
    productIds: string[],
    lang: string,
    colorCodes?: string[],
  ): Promise<{ hex: string; name: string; count: number; code: string }[]> {
    if (productIds.length === 0) return [];

    const colorFilter =
      colorCodes && colorCodes.length > 0
        ? Prisma.sql`AND pc."colorCode" IN (${Prisma.join(colorCodes)})`
        : Prisma.empty;

    const rows = await this.prisma.$queryRaw<
      { hexColor: string; count: bigint; colorId: string; colorCode: string }[]
    >`
      SELECT pc."hexColor",
             COUNT(DISTINCT pc."productId") AS "count",
             MIN(pc."id"::text)::uuid AS "colorId",
             MIN(pc."colorCode") AS "colorCode"
      FROM "ProductColor" pc
      WHERE pc."productId" IN (${Prisma.join(productIds)})
        AND pc."saleState" = 'active'
        AND pc."hexColor" IS NOT NULL
        ${colorFilter}
      GROUP BY pc."hexColor"
      ORDER BY "count" DESC
    `;

    if (rows.length === 0) return [];

    const colorIds = rows.map((r) => r.colorId);
    const translations = await this.prisma.translation.findMany({
      where: {
        entityId: { in: colorIds },
        entityType: 'color',
        field: 'colorName',
        langCode: { in: [lang, 'en'] },
      },
    });

    return rows.map((row) => {
      const nameInLang = translations.find(
        (t) => t.entityId === row.colorId && t.langCode === lang,
      );
      const nameInEn = translations.find(
        (t) => t.entityId === row.colorId && t.langCode === 'en',
      );
      const name = (nameInLang ?? nameInEn)?.value ?? '';
      return { hex: row.hexColor, name, count: Number(row.count), code: row.colorCode };
    });
  }

  async getSizeCounts(
    productIds: string[],
    sizeLabels?: string[],
  ): Promise<{ label: string; count: number }[]> {
    if (productIds.length === 0) return [];

    const sizeFilter =
      sizeLabels && sizeLabels.length > 0
        ? Prisma.sql`AND s."sizeLabel" IN (${Prisma.join(sizeLabels)})`
        : Prisma.empty;

    const rows = await this.prisma.$queryRaw<
      { sizeLabel: string; count: bigint }[]
    >`
      SELECT s."sizeLabel", COUNT(DISTINCT pc."productId") AS "count"
      FROM "ProductSku" s
      INNER JOIN "ProductColor" pc
        ON pc."id" = s."colorId" AND pc."saleState" = 'active'
      WHERE pc."productId" IN (${Prisma.join(productIds)})
        AND s."saleState" = 'active'
        AND s."isDiscontinued" = false
        AND s."sizeLabel" IS NOT NULL
        ${sizeFilter}
      GROUP BY s."sizeLabel"
    `;

    return rows.map((r) => ({ label: r.sizeLabel, count: Number(r.count) }));
  }

  private async getBrandCounts(
    productIds: string[],
  ): Promise<{ name: string; count: number }[]> {
    if (productIds.length === 0) return [];

    const rows = await this.prisma.$queryRaw<
      { brand: string; count: bigint }[]
    >`
      SELECT p."brand", COUNT(DISTINCT p."id") AS "count"
      FROM "Product" p
      WHERE p."id" IN (${Prisma.join(productIds)})
      GROUP BY p."brand"
      ORDER BY "count" DESC
    `;

    return rows.map((r) => ({ name: r.brand, count: Number(r.count) }));
  }

  private async computePriceRange(
    productIds: string[],
  ): Promise<{ min: number | null; max: number | null }> {
    if (productIds.length === 0) return { min: null, max: null };

    const result = await this.prisma.$queryRaw<
      { min: number | null; max: number | null }[]
    >`
      SELECT MIN(sub."minPrice")::float AS "min",
             MAX(sub."minPrice")::float AS "max"
      FROM (
        SELECT pc."productId", MIN(s."publicPrice") AS "minPrice"
        FROM "ProductSku" s
        INNER JOIN "ProductColor" pc
          ON pc."id" = s."colorId" AND pc."saleState" = 'active'
        WHERE pc."productId" IN (${Prisma.join(productIds)})
          AND s."saleState" = 'active'
          AND s."isDiscontinued" = false
        GROUP BY pc."productId"
      ) sub
    `;

    return { min: result[0]?.min ?? null, max: result[0]?.max ?? null };
  }

  // ─── search ───────────────────────────────────────────────────────────────

  async searchProducts(
    q: string,
    lang: string,
    page: number,
    limit: number,
  ): Promise<{ products: ProductListRaw[]; total: number }> {
    const partial = `%${q}%`;
    const offset = (page - 1) * limit;

    const searchRows = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT sub."id"
      FROM (
        SELECT p."id", p."lastChange",
          MIN(CASE
            WHEN COALESCE(tn."value", tn_en."value") ILIKE ${q} THEN 1
            WHEN COALESCE(tn."value", tn_en."value") ILIKE ${partial} THEN 2
            ELSE 3
          END) AS "relevance"
        FROM "Product" p
        LEFT JOIN "Translation" tn
          ON tn."entityId" = p."id"
          AND tn."entityType" = 'product' AND tn."field" = 'name'
          AND tn."langCode" = ${lang}
        LEFT JOIN "Translation" tn_en
          ON tn_en."entityId" = p."id"
          AND tn_en."entityType" = 'product' AND tn_en."field" = 'name'
          AND tn_en."langCode" = 'en'
        LEFT JOIN "Translation" td
          ON td."entityId" = p."id"
          AND td."entityType" = 'product' AND td."field" = 'description'
          AND td."langCode" = ${lang}
        LEFT JOIN "Translation" td_en
          ON td_en."entityId" = p."id"
          AND td_en."entityType" = 'product' AND td_en."field" = 'description'
          AND td_en."langCode" = 'en'
        LEFT JOIN "ProductColor" spc
          ON spc."productId" = p."id" AND spc."saleState" = 'active'
        LEFT JOIN "Translation" tc
          ON tc."entityId" = spc."id"
          AND tc."entityType" = 'color' AND tc."field" = 'colorName'
          AND tc."langCode" = ${lang}
        LEFT JOIN "Translation" tc_en
          ON tc_en."entityId" = spc."id"
          AND tc_en."entityType" = 'color' AND tc_en."field" = 'colorName'
          AND tc_en."langCode" = 'en'
        WHERE p."saleState" = 'active'
          AND (
            COALESCE(tn."value", tn_en."value") ILIKE ${partial}
            OR COALESCE(td."value", td_en."value") ILIKE ${partial}
            OR COALESCE(tc."value", tc_en."value") ILIKE ${partial}
            OR p."brand" ILIKE ${partial}
            OR p."catalogReference" ILIKE ${partial}
          )
        GROUP BY p."id", p."lastChange"
      ) sub
      ORDER BY sub."relevance" ASC, sub."lastChange" DESC
      OFFSET ${offset}
      LIMIT ${limit}
    `;

    const countRows = await this.prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT p."id") AS "count"
      FROM "Product" p
      LEFT JOIN "Translation" tn
        ON tn."entityId" = p."id"
        AND tn."entityType" = 'product' AND tn."field" = 'name'
        AND tn."langCode" = ${lang}
      LEFT JOIN "Translation" tn_en
        ON tn_en."entityId" = p."id"
        AND tn_en."entityType" = 'product' AND tn_en."field" = 'name'
        AND tn_en."langCode" = 'en'
      LEFT JOIN "Translation" td
        ON td."entityId" = p."id"
        AND td."entityType" = 'product' AND td."field" = 'description'
        AND td."langCode" = ${lang}
      LEFT JOIN "Translation" td_en
        ON td_en."entityId" = p."id"
        AND td_en."entityType" = 'product' AND td_en."field" = 'description'
        AND td_en."langCode" = 'en'
      LEFT JOIN "ProductColor" spc
        ON spc."productId" = p."id" AND spc."saleState" = 'active'
      LEFT JOIN "Translation" tc
        ON tc."entityId" = spc."id"
        AND tc."entityType" = 'color' AND tc."field" = 'colorName'
        AND tc."langCode" = ${lang}
      LEFT JOIN "Translation" tc_en
        ON tc_en."entityId" = spc."id"
        AND tc_en."entityType" = 'color' AND tc_en."field" = 'colorName'
        AND tc_en."langCode" = 'en'
      WHERE p."saleState" = 'active'
        AND (
          COALESCE(tn."value", tn_en."value") ILIKE ${partial}
          OR COALESCE(td."value", td_en."value") ILIKE ${partial}
          OR COALESCE(tc."value", tc_en."value") ILIKE ${partial}
          OR p."brand" ILIKE ${partial}
          OR p."catalogReference" ILIKE ${partial}
        )
    `;

    const total = Number(countRows[0]?.count ?? 0);
    const productIds = searchRows.map((r) => r.id);

    if (productIds.length === 0) {
      return { products: [], total };
    }

    const products = await this.fetchProductsWithDetails(productIds, true);
    await this.attachTranslations(products as AttachableProduct[]);
    return { products: products as unknown as ProductListRaw[], total };
  }

  // ─── product detail ───────────────────────────────────────────────────────

  async getProductDetail(catalogReference: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        catalogReference,
        saleState: 'active',
      },
      include: {
        images: true,
        categories: {
          include: {
            category: true,
          },
        },
        colors: {
          where: { saleState: 'active' },
          include: {
            packshots: true,
            skus: {
              where: { saleState: 'active', isDiscontinued: false },
            },
          },
        },
      },
    });

    if (product) {
      await this.attachTranslations([product] as AttachableProduct[]);
    }

    return product;
  }

  // ─── private helpers ──────────────────────────────────────────────────────

  private buildProductWhereInput(
    filters: ProductFilters,
  ): Prisma.ProductWhereInput {
    const priceFilter =
      filters.minPrice !== undefined || filters.maxPrice !== undefined
        ? {
            ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
            ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
          }
        : undefined;

    const andConditions: Prisma.ProductWhereInput[] = [
      {
        colors: {
          some: {
            saleState: 'active',
            skus: {
              some: {
                saleState: 'active',
                isDiscontinued: false,
                ...(priceFilter && { publicPrice: priceFilter }),
              },
            },
          },
        },
      },
    ];

    if (filters.searchIds !== undefined) {
      andConditions.push({ id: { in: filters.searchIds } });
    }

    if (filters.colors && filters.colors.length > 0) {
      andConditions.push({
        colors: {
          some: {
            saleState: 'active',
            colorCode: { in: filters.colors },
          },
        },
      });
    }

    if (filters.sizes && filters.sizes.length > 0) {
      andConditions.push({
        colors: {
          some: {
            saleState: 'active',
            skus: {
              some: {
                saleState: 'active',
                isDiscontinued: false,
                sizeLabel: { in: filters.sizes },
              },
            },
          },
        },
      });
    }

    const where: Prisma.ProductWhereInput = {
      saleState: 'active',
      AND: andConditions,
    };

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      where.categories = { some: { categoryId: { in: filters.categoryIds } } };
    }
    if (filters.organic !== undefined) {
      where.organic = filters.organic;
    }
    if (filters.recycled !== undefined) {
      where.recycled = filters.recycled;
    }
    if (filters.brands && filters.brands.length > 0) {
      where.brand = { in: filters.brands };
    }

    return where;
  }

  private async fetchProductsWithDetails(
    productIds: string[],
    preserveOrder = false,
  ): Promise<ProductListItem[]> {
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        images: { where: { isMain: true }, take: 1 },
        categories: { include: { category: true } },
        colors: {
          where: { saleState: 'active' },
          include: {
            skus: { where: { saleState: 'active', isDiscontinued: false } },
          },
        },
      },
    });

    if (preserveOrder) {
      products.sort(
        (a, b) => productIds.indexOf(a.id) - productIds.indexOf(b.id),
      );
    }

    return products;
  }

  private async attachTranslations(products: AttachableProduct[]) {
    if (products.length === 0) return;

    const allIds = new Set<string>();

    for (const p of products) {
      allIds.add(p.id);
      p.categories.forEach((c) => allIds.add(c.categoryId));
      p.colors.forEach((col) => allIds.add(col.id));
    }

    if (allIds.size === 0) return;

    const translations = await this.prisma.translation.findMany({
      where: { entityId: { in: Array.from(allIds) } },
    });

    for (const p of products) {
      p.translations = translations.filter((t) => t.entityId === p.id);
      p.categories.forEach((c) => {
        c.category.translations = translations.filter(
          (t) => t.entityId === c.categoryId,
        );
      });
      p.colors.forEach((col) => {
        col.translations = translations.filter((t) => t.entityId === col.id);
      });
    }
  }
}
