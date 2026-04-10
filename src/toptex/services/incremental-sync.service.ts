import { Injectable, Logger } from '@nestjs/common';
import { ToptexApiService } from '../services/toptex-api.service';
import { IncrementalSyncRepository } from '../repositories/incremental-sync.repository';
import {
  ToptexProduct,
  ToptexPageResponse,
  ToptexColor,
  ToptexSize,
  ToptexTranslations,
  ToptexDeletedPageResponse,
  ToptexDeletedItem,
} from '../types/toptex-api.types';

const INCREMENTAL_PAGE_SIZE = 100;
const TOPTEX_PRODUCTS_URL = 'https://api.toptex.io/v3/products/all';
const TOPTEX_DELETED_URL = 'https://api.toptex.io/v3/products/deleted';
const SETTING_UPSERT = 'last_upsert_sync';
const SETTING_DELETED = 'last_deleted_sync';
const LANGS: string[] = ['en', 'fr', 'de'];

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function firstString(
  value: ToptexTranslations | string | string[] | undefined,
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0) {
    const item = value[0];
    if (typeof item === 'string') return item;
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    const t = value;
    return t.en || t.fr || t.de || '';
  }
  return String(value);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class IncrementalSyncService {
  private readonly logger = new Logger(IncrementalSyncService.name);

  constructor(
    private readonly toptexApi: ToptexApiService,
    private readonly syncRepo: IncrementalSyncRepository,
  ) {}

  // ─── Upsert Sync ────────────────────────────────────────────────────────────

  async runUpsertSync(modifiedSince?: string): Promise<string> {
    const syncLog = await this.syncRepo.createSyncLog({
      type: 'upsert',
      status: 'running',
    });

    // Run in background
    this.executeUpsertSync(syncLog.id, modifiedSince).catch(() => {
      // errors are handled inside executeUpsertSync
    });

    return syncLog.id;
  }

  private async executeUpsertSync(
    syncLogId: string,
    modifiedSince?: string,
  ): Promise<void> {
    const startedAt = new Date();
    let totalPages = 0;
    let processedItems = 0;
    let failedItems = 0;

    try {
      // If no modifiedSince provided — read from settings
      let since = modifiedSince;
      if (!since) {
        const stored = await this.syncRepo.getSetting(SETTING_UPSERT);
        if (stored) since = stored;
      }

      let page = 1;

      while (true) {
        const params: Record<string, string | number> = {
          display_prices: 1,
          lang: LANGS.join(','),
          usage_right: 'b2c_uniquement',
          page_number: page,
          page_size: INCREMENTAL_PAGE_SIZE,
        };
        if (since) params['modified_since'] = since;

        const data = await this.toptexApi.get<ToptexPageResponse>(
          TOPTEX_PRODUCTS_URL,
          { params },
        );

        if (!data?.items || data.items.length === 0) break;

        totalPages = page;

        for (const item of data.items) {
          try {
            await this.upsertProduct(item);
            processedItems++;
          } catch (err) {
            failedItems++;
            this.logger.error(
              `Failed to upsert product ${item.catalogReference}: ${err instanceof Error ? err.message : String(err)}`,
            );
          }
        }

        this.logger.log(
          `Upsert sync — page ${page} done (${data.items.length} items). Processed: ${processedItems}, Failed: ${failedItems}`,
        );

        if (data.items.length < INCREMENTAL_PAGE_SIZE) break;
        page++;
      }

      await this.syncRepo.upsertSetting(
        SETTING_UPSERT,
        startedAt.toISOString(),
      );

      await this.syncRepo.updateSyncLog(syncLogId, {
        status: 'success',
        finishedAt: new Date(),
        totalPages,
        processedItems,
        failedItems,
      });

      this.logger.log(
        `Upsert sync complete. Pages: ${totalPages}, Processed: ${processedItems}, Failed: ${failedItems}`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Upsert sync unrecoverable error: ${message}`);

      await this.syncRepo.updateSyncLog(syncLogId, {
        status: 'failed',
        finishedAt: new Date(),
        totalPages,
        processedItems,
        failedItems,
        errorMessage: message,
      });
    }
  }

  private async upsertProduct(item: ToptexProduct): Promise<void> {
    const ref = item.catalogReference;

    const product = await this.syncRepo.upsertProduct(ref, {
      brand: item.brand || '',
      weight: item.averageWeight ?? null,
      gender: firstString(item.gender) || null,
      labelType: item.labelType ?? null,
      organic: item.organic === '1' || item.organic === true,
      recycled: item.recycled === '1' || item.recycled === true,
      vegan: item.vegan === '1' || item.vegan === true,
      oekoTex: item.oekoTex === '1' || item.oekoTex === true,
      saleState: item.saleState ?? 'active',
      lastChange: parseDate(item.lastChange),
      toptexCreatedAt: parseDate(item.createdDate),
    });

    // Translations
    const translatableFields: Record<string, ToptexTranslations | undefined> = {
      name: item.designation,
      description: item.description,
      composition: item.composition,
      mainMaterials: item.mainMaterials,
    };

    for (const [field, obj] of Object.entries(translatableFields)) {
      if (!obj || typeof obj !== 'object') continue;
      const objMap = obj as Record<string, string | undefined>;
      for (const lang of LANGS) {
        const value = objMap[lang];
        if (!value) continue;
        await this.syncRepo.upsertTranslation(
          product.id,
          'product',
          lang,
          field,
          value,
        );
      }
    }

    // Categories
    if (item.family && typeof item.family === 'object') {
      const familyId = await this.upsertCategory(item.family, null);
      let targetCategoryId = familyId;

      const subFamily = item.sub_family;
      if (
        subFamily &&
        typeof subFamily === 'object' &&
        Object.values(subFamily).some((v) => v)
      ) {
        const subFamilyId = await this.upsertCategory(subFamily, familyId);
        targetCategoryId = subFamilyId;
      }

      await this.syncRepo.upsertProductCategory(product.id, targetCategoryId);
    }

    // Images
    const images = item.images ?? [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (!img.url_image) continue;
      await this.syncRepo.upsertProductImage(product.id, img.url_image, {
        imageId: img.image_id ? Number(img.image_id) : null,
        urlAuthenticated: img.url ?? null,
        isMain: i === 0,
        lastUpdate: parseDate(img.last_update),
      });
    }

    // Colors
    const colors: ToptexColor[] = item.colors ?? [];
    for (const colorItem of colors) {
      await this.upsertColor(product.id, colorItem);
    }
  }

  private async upsertColor(
    productId: string,
    colorItem: ToptexColor,
  ): Promise<void> {
    const firstSku = colorItem.sizes?.[0]?.sku ?? '';
    const skuParts = firstSku.split('_');
    const resolvedColorCode =
      skuParts[1] || colorItem.colorCode || colorItem.colorsHexa?.[0] || '';

    if (!resolvedColorCode) return;

    const color = await this.syncRepo.upsertProductColor(
      productId,
      resolvedColorCode,
      {
        hexColor: colorItem.colorsHexa?.[0]
          ? `#${colorItem.colorsHexa[0]}`
          : null,
        pantone: colorItem.colorsPantone?.[0] ?? null,
        rgb: colorItem.colorsRGB?.[0] ?? null,
        cmyk: colorItem.colorsCMYK?.[0] ?? null,
        saleState: colorItem.saleState ?? 'active',
        lastChange: parseDate(colorItem.lastChange),
      },
    );

    // Color translations
    const colorNames = colorItem.colors;
    if (colorNames && typeof colorNames === 'object') {
      const colorNamesMap = colorNames as Record<string, string | undefined>;
      for (const lang of LANGS) {
        const value = colorNamesMap[lang];
        if (!value) continue;
        await this.syncRepo.upsertTranslation(
          color.id,
          'color',
          lang,
          'colorName',
          value,
        );
      }
    }

    // Packshots
    const packshots = colorItem.packshots ?? {};
    for (const [angleName, psData] of Object.entries(packshots)) {
      if (!psData?.url_image) continue;
      await this.syncRepo.upsertColorPackshot(
        color.id,
        psData.url_image,
        angleName,
        {
          imageId: psData.image_id ? Number(psData.image_id) : null,
          urlAuthenticated: psData.url ?? null,
          lastUpdate: parseDate(psData.last_update),
        },
      );
    }

    // SKUs
    const sizes: ToptexSize[] = colorItem.sizes ?? [];
    for (const sizeItem of sizes) {
      if (!sizeItem.sku) continue;

      const priceRaw = sizeItem.prices?.find((p) => p.quantity === 1)?.price;
      const price = priceRaw ? parseFloat(priceRaw) : 0;

      const publicPriceRaw =
        sizeItem.publicUnitPrice?.replace(/[^0-9.,]/g, '').replace(',', '.') ??
        null;
      const publicPrice = publicPriceRaw ? parseFloat(publicPriceRaw) : null;

      await this.syncRepo.upsertProductSku(sizeItem.sku, {
        colorId: color.id,
        ean: sizeItem.ean ?? null,
        barCode: sizeItem.barCode ?? null,
        sizeLabel: sizeItem.size ?? null,
        sizeCode: sizeItem.sizeCode ?? null,
        price,
        publicPrice,
        unitsPerBox: sizeItem.unitsPerBox ?? null,
        unitsPerPack: sizeItem.unitsPerPack ?? null,
        isNew: sizeItem.isNew === 1 || sizeItem.isNew === true,
        isDiscontinued:
          sizeItem.isDiscontinued === 1 || sizeItem.isDiscontinued === true,
        saleState: sizeItem.saleState ?? 'active',
      });
    }
  }

  private async upsertCategory(
    nameByLang: ToptexTranslations,
    parentId: string | null,
  ): Promise<string> {
    const slug = slugify(
      nameByLang.en ||
        nameByLang.fr ||
        Object.values(nameByLang).find((v): v is string => Boolean(v)) ||
        '',
    );
    const categoryId = await this.syncRepo.upsertCategory(slug, parentId);
    const nameByLangMap = nameByLang as Record<string, string | undefined>;

    for (const lang of LANGS) {
      const value = nameByLangMap[lang];
      if (!value) continue;
      await this.syncRepo.upsertTranslation(
        categoryId,
        'category',
        lang,
        'name',
        value,
      );
    }
    return categoryId;
  }

  // ─── Deleted Sync ───────────────────────────────────────────────────────────

  async runDeletedSync(deletedSince?: string): Promise<string> {
    const syncLog = await this.syncRepo.createSyncLog({
      type: 'deleted',
      status: 'running',
    });

    // Run in background
    this.executeDeletedSync(syncLog.id, deletedSince).catch(() => {
      // errors are handled inside executeDeletedSync
    });

    return syncLog.id;
  }

  private async executeDeletedSync(
    syncLogId: string,
    deletedSince?: string,
  ): Promise<void> {
    let totalPages = 0;
    let processedItems = 0;
    let failedItems = 0;

    try {
      let since = deletedSince;
      if (!since) {
        const stored = await this.syncRepo.getSetting(SETTING_DELETED);
        since = stored ?? 'all';
      }

      let page = 1;

      while (true) {
        const data = await this.toptexApi.get<ToptexDeletedPageResponse>(
          TOPTEX_DELETED_URL,
          {
            params: {
              deleted_since: since,
              page_size: INCREMENTAL_PAGE_SIZE,
              page_number: page,
            },
          },
        );

        if (!data?.items || data.items.length === 0) break;

        totalPages = page;

        for (const deletedItem of data.items) {
          try {
            await this.processDeletedItem(deletedItem);
            processedItems++;
          } catch (err) {
            failedItems++;
            this.logger.error(
              `Failed to process deleted item ${deletedItem.catalog_id}: ${err instanceof Error ? err.message : String(err)}`,
            );
          }
        }

        this.logger.log(
          `Deleted sync — page ${page} done (${data.items.length} items). Processed: ${processedItems}, Failed: ${failedItems}`,
        );

        if (data.items.length < INCREMENTAL_PAGE_SIZE) break;
        page++;
      }

      await this.syncRepo.upsertSetting(
        SETTING_DELETED,
        new Date().toISOString(),
      );

      await this.syncRepo.updateSyncLog(syncLogId, {
        status: 'success',
        finishedAt: new Date(),
        totalPages,
        processedItems,
        failedItems,
      });

      this.logger.log(
        `Deleted sync complete. Pages: ${totalPages}, Processed: ${processedItems}, Failed: ${failedItems}`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Deleted sync unrecoverable error: ${message}`);

      await this.syncRepo.updateSyncLog(syncLogId, {
        status: 'failed',
        finishedAt: new Date(),
        totalPages,
        processedItems,
        failedItems,
        errorMessage: message,
      });
    }
  }

  private async processDeletedItem(
    deletedItem: ToptexDeletedItem,
  ): Promise<void> {
    if (deletedItem.catalog_type !== 'size') return;

    const found = await this.syncRepo.markSkuDiscontinued(
      deletedItem.catalog_id,
    );
    if (!found) {
      this.logger.warn(
        `Deleted item SKU not found in DB, skipping: ${deletedItem.catalog_id}`,
      );
    }
  }
}
