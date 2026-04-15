import { Injectable, Logger } from '@nestjs/common';
import { ToptexApiService } from '../services/toptex-api.service';
import { ToptexRepository } from '../repositories/toptex.repository';

const PAGE_SIZE = 50;
const LANGS = 'fr,en,de,nl';

// Helpers
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function firstString(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0) {
    const item = value[0];
    if (typeof item === 'string') return item;
    if (typeof item === 'object') return item.en || item.fr || item.de || item.nl || '';
  }
  if (typeof value === 'object') return value.en || value.fr || value.de || value.nl || '';
  return String(value);
}

interface HardUpsertStats {
  productsProcessed: number;
  productsCreated: number;
  productsUpdated: number;
  imagesUpdated: number;
  imagesCreated: number;
  colorsProcessed: number;
  skusProcessed: number;
  packshots: number;
  errorCount: number;
  startTime: Date;
  endTime?: Date;
}

export type { HardUpsertStats };

@Injectable()
export class ToptexHardUpsertHandler {
  private readonly logger = new Logger(ToptexHardUpsertHandler.name);
  private stats!: HardUpsertStats;

  constructor(
    private readonly toptexApi: ToptexApiService,
    private readonly toptexRepo: ToptexRepository,
  ) {}

  async execute(
    startPage: number = 1,
  ): Promise<{ message: string; stats: HardUpsertStats }> {
    this.logger.log('=== Starting Hard Upsert Toptex Sync (NO DATA DELETION) ===');
    this.logger.log(
      'This operation will UPDATE all existing products and their images/colors/skus without deleting any data.',
    );

    // Ensure all supported languages exist (upsert is safe — no-op if already present)
    await this.seedLanguages();

    this.stats = {
      productsProcessed: 0,
      productsCreated: 0,
      productsUpdated: 0,
      imagesUpdated: 0,
      imagesCreated: 0,
      colorsProcessed: 0,
      skusProcessed: 0,
      packshots: 0,
      errorCount: 0,
      startTime: new Date(),
    };

    let page = startPage;
    let hasMorePages = true;

    while (hasMorePages) {
      let data;
      let retries = 0;
      let success = false;

      while (retries < 3 && !success) {
        try {
          this.logger.debug(`Fetching page ${page} (Attempt ${retries + 1}/3)...`);
          data = await this.fetchPage(page);

          if (!data || !data.items || !Array.isArray(data.items)) {
            throw new Error(
              `Data items is not iterable. Raw data: ${JSON.stringify(data).substring(0, 500)}`,
            );
          }

          success = true;
          this.logger.debug(
            `✓ Page ${page} fetched successfully. ${data.items.length} items received.`,
          );
        } catch (err) {
          retries++;
          const errorMsg = err instanceof Error ? err.message : String(err);
          this.logger.warn(
            `✗ Error on page ${page} (Attempt ${retries}/3): ${errorMsg}`,
          );
          if (retries < 3) {
            this.logger.warn(
              `Waiting 3 minutes before retrying page ${page}...`,
            );
            await new Promise((r) => setTimeout(r, 180000)); // 3 minutes
          }
        }
      }

      if (!success) {
        this.logger.error(
          `✗ Failed to fetch page ${page} after 3 attempts. Stopping sync loop.`,
        );
        this.stats.errorCount++;
        break;
      }

      if (data.items.length === 0) {
        this.logger.log(
          `✓ Page ${page} returned empty items array. All pages processed!`,
        );
        hasMorePages = false;
        break;
      }

      for (const item of data.items) {
        try {
          await this.hardUpsertProduct(item);
          this.stats.productsProcessed++;
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          this.logger.error(
            `✗ Failed on product ${item?.catalogReference}: ${errorMsg}`,
          );
          this.stats.errorCount++;
        }
      }

      this.logger.log(
        `✓ Page ${page} complete. Processed: ${this.stats.productsProcessed} | ` +
          `Created: ${this.stats.productsCreated} | ` +
          `Updated: ${this.stats.productsUpdated} | ` +
          `Errors: ${this.stats.errorCount}`,
      );

      page++;
      // Play it safe: 2 second pause between healthy requests
      await new Promise((r) => setTimeout(r, 2000));
    }

    this.stats.endTime = new Date();
    const duration =
      (this.stats.endTime.getTime() - this.stats.startTime.getTime()) / 1000;

    await this.toptexRepo.upsertSetting(
      'toptex_last_hard_upsert',
      new Date().toISOString(),
    );

    this.logger.log('=== Hard Upsert Complete ===');
    this.logger.log(`Duration: ${duration}s`);
    this.logger.log(`Products Processed: ${this.stats.productsProcessed}`);
    this.logger.log(`  - Created: ${this.stats.productsCreated}`);
    this.logger.log(`  - Updated: ${this.stats.productsUpdated}`);
    this.logger.log(`Images: ${this.stats.imagesCreated} created, ${this.stats.imagesUpdated} updated`);
    this.logger.log(`Colors: ${this.stats.colorsProcessed}`);
    this.logger.log(`SKUs: ${this.stats.skusProcessed}`);
    this.logger.log(`Packshots: ${this.stats.packshots}`);
    this.logger.log(`Errors: ${this.stats.errorCount}`);

    return {
      message: `Hard upsert complete. All products refreshed with latest data (including image tokens).`,
      stats: this.stats,
    };
  }

  private async fetchPage(
    page: number,
  ): Promise<{ items: any[]; total_count: number }> {
    return this.toptexApi.get<any>('https://api.toptex.io/v3/products/all', {
      params: {
        display_prices: 1,
        lang: LANGS,
        usage_right: 'b2c_uniquement',
        page_number: page,
        page_size: PAGE_SIZE,
      },
    });
  }

  private async seedLanguages(): Promise<void> {
    this.logger.debug('Seeding languages...');
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
      { code: 'de', name: 'Deutsch' },
      { code: 'nl', name: 'Nederlands' },
    ];
    for (const lang of languages) {
      await this.toptexRepo.upsertLanguage(lang.code, lang.name);
    }
    this.logger.debug('✓ Languages seeded');
  }

  private async upsertCategory(
    nameByLang: Record<string, string>,
    parentId: string | null,
  ): Promise<string> {
    const slug = slugify(
      nameByLang['en'] || nameByLang['fr'] || Object.values(nameByLang)[0],
    );
    const categoryId = await this.toptexRepo.upsertCategory(slug, parentId);

    for (const [lang, value] of Object.entries(nameByLang)) {
      if (!value) continue;
      await this.toptexRepo.upsertTranslation(
        categoryId,
        'category',
        lang,
        'name',
        value,
      );
    }
    return categoryId;
  }

  private async hardUpsertProduct(item: any): Promise<void> {
    const ref = item.catalogReference;
    this.logger.debug(`[${ref}] Processing product...`);

    // Check if product already exists
    const existingProduct = await this.toptexRepo.findProductByRef(ref);
    const isCreating = !existingProduct;

    // Upsert product
    const product = await this.toptexRepo.upsertProduct(ref, {
      brand: item.brand || '',
      weight: item.averageWeight || null,
      gender: firstString(item.gender) || null,
      labelType: item.labelType || null,
      organic: item.organic === '1' || item.organic === true,
      recycled: item.recycled === '1' || item.recycled === true,
      vegan: item.vegan === '1' || item.vegan === true,
      oekoTex: item.oekoTex === '1' || item.oekoTex === true,
      saleState: item.saleState || 'active',
      lastChange: parseDate(item.lastChange),
      toptexCreatedAt: parseDate(item.createdDate),
    });

    if (isCreating) {
      this.stats.productsCreated++;
      this.logger.debug(`  ✓ Product CREATED: ${ref}`);
    } else {
      this.stats.productsUpdated++;
      this.logger.debug(`  ✓ Product UPDATED: ${ref}`);
    }

    // Upsert translations
    const translatable: Record<string, any> = {
      name: item.designation,
      description: item.description,
      composition: item.composition,
    };

    for (const [field, obj] of Object.entries(translatable)) {
      if (!obj || typeof obj !== 'object') continue;
      for (const [lang, value] of Object.entries(
        obj as Record<string, string>,
      )) {
        if (!value) continue;
        await this.toptexRepo.upsertTranslation(
          product.id,
          'product',
          lang,
          field,
          value,
        );
      }
    }
    this.logger.debug(`  ✓ Translations updated`);

    // Upsert categories
    const familyObj = item.family;
    const subFamilyObj =
      typeof item.sub_family === 'object' && !Array.isArray(item.sub_family)
        ? item.sub_family
        : null;

    if (familyObj && typeof familyObj === 'object') {
      const familyId = await this.upsertCategory(familyObj, null);
      let subFamilyId: string | null = null;
      if (subFamilyObj && Object.values(subFamilyObj).some((v) => v)) {
        subFamilyId = await this.upsertCategory(subFamilyObj, familyId);
      }
      const categoryId = subFamilyId || familyId;
      await this.toptexRepo.upsertProductCategory(product.id, categoryId);
    }
    this.logger.debug(`  ✓ Categories processed`);

    // Hard upsert images - Update/Create with fresh token URLs
    const images: any[] = item.images || [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (!img.image_id) continue;

      const existing = await this.toptexRepo.findProductImageById(
        parseInt(img.image_id),
      );
      const payload = {
        urlImage: img.url_image || '',
        urlAuthenticated: img.url || null, // Fresh token URL
        isMain: i === 0,
        lastUpdate: parseDate(img.last_update),
      };

      if (existing) {
        await this.toptexRepo.updateProductImage(existing.id, payload);
        this.stats.imagesUpdated++;
        this.logger.debug(
          `    ✓ Image updated with fresh token: ${img.image_id}`,
        );
      } else {
        await this.toptexRepo.createProductImage({
          productId: product.id,
          imageId: parseInt(img.image_id),
          ...payload,
        });
        this.stats.imagesCreated++;
        this.logger.debug(`    ✓ Image created: ${img.image_id}`);
      }
    }

    // Hard upsert colors and packshots
    const colors: any[] = item.colors || [];
    for (const colorItem of colors) {
      const colorCode = colorItem.colorsCMYK?.[0]
        ? colorItem.colorCode
        : colorItem.colorCode || '';
      const toptexColorCode =
        colorItem.colorCode || colorItem.colorsHexa?.[0] || '';

      const firstSku = colorItem.sizes?.[0]?.sku || '';
      const skuParts = firstSku.split('_');
      const resolvedColorCode = skuParts[1] || toptexColorCode;

      const colorData = {
        hexColor: colorItem.colorsHexa?.[0]
          ? `#${colorItem.colorsHexa[0]}`
          : null,
        pantone: colorItem.colorsPantone?.[0] || null,
        rgb: colorItem.colorsRGB?.[0] || null,
        cmyk: colorItem.colorsCMYK?.[0] || null,
        saleState: colorItem.saleState || 'active',
        lastChange: parseDate(colorItem.lastChange),
      };

      const color = await this.toptexRepo.upsertProductColor(
        product.id,
        resolvedColorCode,
        colorData,
      );
      this.stats.colorsProcessed++;

      // Color translations
      const colorNameObj = colorItem.colors;
      if (colorNameObj && typeof colorNameObj === 'object') {
        for (const [lang, value] of Object.entries(
          colorNameObj as Record<string, string>,
        )) {
          if (!value) continue;
          await this.toptexRepo.upsertTranslation(
            color.id,
            'color',
            lang,
            'colorName',
            value,
          );
        }
      }

      // Hard upsert packshots with fresh token URLs
      const packshots = colorItem.packshots || {};
      for (const [angle, psData] of Object.entries(
        packshots as Record<string, any>,
      )) {
        if (!psData?.image_id) continue;
        const pExisting = await this.toptexRepo.findColorPackshot(
          color.id,
          angle,
        );

        const psPayload = {
          imageId: parseInt(psData.image_id),
          urlImage: psData.url_image || psData.url || '',
          urlAuthenticated: psData.url || null, // Fresh token URL
          lastUpdate: parseDate(psData.last_update),
        };

        if (pExisting) {
          await this.toptexRepo.updateColorPackshot(pExisting.id, psPayload);
          this.logger.debug(
            `    ✓ Packshot updated (${angle}): ${psData.image_id}`,
          );
        } else {
          await this.toptexRepo.createColorPackshot({
            colorId: color.id,
            angleName: angle,
            ...psPayload,
          });
          this.logger.debug(
            `    ✓ Packshot created (${angle}): ${psData.image_id}`,
          );
        }
        this.stats.packshots++;
      }

      // Hard upsert SKUs
      const sizes: any[] = colorItem.sizes || [];
      for (const sizeItem of sizes) {
        if (!sizeItem.sku) continue;
        const price = parseFloat(sizeItem.prices?.[0]?.price) || 0;
        const publicPriceRaw =
          sizeItem.publicUnitPrice
            ?.replace(/[^0-9.,]/g, '')
            .replace(',', '.') || null;
        const publicPrice = publicPriceRaw ? parseFloat(publicPriceRaw) : null;

        await this.toptexRepo.upsertProductSku(sizeItem.sku, {
          colorId: color.id,
          ean: sizeItem.ean || null,
          barCode: sizeItem.barCode || null,
          sizeLabel: sizeItem.size || null,
          sizeCode: sizeItem.sizeCode || null,
          price,
          publicPrice,
          unitsPerBox: sizeItem.unitsPerBox || null,
          unitsPerPack: sizeItem.unitsPerPack || null,
          isNew: sizeItem.isNew === 1 || sizeItem.isNew === true,
          isDiscontinued:
            sizeItem.isDiscontinued === 1 ||
            sizeItem.isDiscontinued === true,
          saleState: sizeItem.saleState || 'active',
        });
        this.stats.skusProcessed++;
      }
    }

    this.logger.debug(`  ✓ Product ${ref} fully processed`);
  }
}
