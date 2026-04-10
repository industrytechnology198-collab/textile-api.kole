import { Injectable } from '@nestjs/common';
import { Prisma, SyncLog } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export interface CreateSyncLogData {
  type: string;
  status: string;
}

export interface UpdateSyncLogData {
  status: string;
  finishedAt: Date;
  totalPages?: number;
  processedItems?: number;
  failedItems?: number;
  errorMessage?: string;
}

export interface GetSyncLogsQuery {
  page: number;
  limit: number;
  type?: string;
  status?: string;
}

export interface PaginatedSyncLogs {
  data: SyncLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class IncrementalSyncRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSyncLog(data: CreateSyncLogData): Promise<SyncLog> {
    return this.prisma.syncLog.create({ data });
  }

  async updateSyncLog(id: string, data: UpdateSyncLogData): Promise<SyncLog> {
    return this.prisma.syncLog.update({ where: { id }, data });
  }

  async findSyncLogById(id: string): Promise<SyncLog | null> {
    return this.prisma.syncLog.findUnique({ where: { id } });
  }

  async findSyncLogs(query: GetSyncLogsQuery): Promise<PaginatedSyncLogs> {
    const skip = (query.page - 1) * query.limit;
    const where = {
      ...(query.type ? { type: query.type } : {}),
      ...(query.status ? { status: query.status } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.syncLog.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.syncLog.count({ where }),
    ]);

    return {
      data,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async findLastSyncLogByType(type: string): Promise<SyncLog | null> {
    return this.prisma.syncLog.findFirst({
      where: { type },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSetting(key: string): Promise<string | null> {
    const setting = await this.prisma.settings.findUnique({ where: { key } });
    return setting?.value ?? null;
  }

  async upsertSetting(key: string, value: string): Promise<void> {
    await this.prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  // ─── Product upserts ────────────────────────────────────────────────────────

  async upsertProduct(
    catalogReference: string,
    data: Record<string, unknown>,
  ): Promise<{ id: string }> {
    return this.prisma.product.upsert({
      where: { catalogReference },
      update: data as Prisma.ProductUpdateInput,
      create: {
        ...(data as Prisma.ProductCreateInput),
        catalogReference,
      },
      select: { id: true },
    });
  }

  async upsertProductCategory(
    productId: string,
    categoryId: string,
  ): Promise<void> {
    await this.prisma.productCategory.upsert({
      where: { productId_categoryId: { productId, categoryId } },
      update: {},
      create: { productId, categoryId },
    });
  }

  async upsertTranslation(
    entityId: string,
    entityType: string,
    langCode: string,
    field: string,
    value: string,
  ): Promise<void> {
    await this.prisma.translation.upsert({
      where: {
        entityId_entityType_langCode_field: {
          entityId,
          entityType,
          langCode,
          field,
        },
      },
      update: { value },
      create: { entityId, entityType, langCode, field, value },
    });
  }

  async upsertCategory(slug: string, parentId: string | null): Promise<string> {
    const category = await this.prisma.category.upsert({
      where: { slug },
      update: { parentId },
      create: { slug, parentId },
    });
    return category.id;
  }

  async upsertProductColor(
    productId: string,
    colorCode: string,
    data: Record<string, unknown>,
  ): Promise<{ id: string }> {
    return this.prisma.productColor.upsert({
      where: { productId_colorCode: { productId, colorCode } },
      update: data,
      create: { productId, colorCode, ...data },
      select: { id: true },
    });
  }

  async upsertProductSku(
    sku: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    await this.prisma.productSku.upsert({
      where: { sku },
      update: data as Prisma.ProductSkuUpdateInput,
      create: {
        ...(data as Prisma.ProductSkuCreateInput),
        sku,
      },
    });
  }

  async upsertProductImage(
    productId: string,
    urlImage: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    const existing = await this.prisma.productImage.findFirst({
      where: { productId, urlImage },
    });
    if (existing) {
      await this.prisma.productImage.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await this.prisma.productImage.create({
        data: { productId, urlImage, ...data },
      });
    }
  }

  async upsertColorPackshot(
    colorId: string,
    urlImage: string,
    angleName: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    const existing = await this.prisma.colorPackshot.findFirst({
      where: { colorId, urlImage },
    });
    if (existing) {
      await this.prisma.colorPackshot.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await this.prisma.colorPackshot.create({
        data: { colorId, urlImage, angleName, ...data },
      });
    }
  }

  async markSkuDiscontinued(skuString: string): Promise<boolean> {
    const sku = await this.prisma.productSku.findUnique({
      where: { sku: skuString },
    });
    if (!sku) return false;

    await this.prisma.productSku.update({
      where: { sku: skuString },
      data: { isDiscontinued: true, saleState: 'discontinued' },
    });
    return true;
  }
}
