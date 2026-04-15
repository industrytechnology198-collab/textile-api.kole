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

@Injectable()
export class ToptexSyncHandler {
  private readonly logger = new Logger(ToptexSyncHandler.name);

  constructor(
    private readonly toptexApi: ToptexApiService,
    private readonly toptexRepo: ToptexRepository,
  ) {}

  async execute(
    continueSync: boolean = false,
    startPage?: number,
  ): Promise<{ message: string; productsSynced: number }> {
    this.logger.log('=== Starting Full Toptex Sync ===');
    const startedAt = new Date();

    if (!continueSync) {
      // The user requested to clear everything and insert full data
      await this.toptexRepo.clearAllData();
      // Seed languages
      await this.seedLanguages();
    } else {
      this.logger.log(`Resuming sync from page ${startPage}...`);
    }

    let page = continueSync && startPage ? startPage : 1;
    let productsSynced = 0;

    while (true) {
      let data;
      let retries = 0;
      let success = false;

      while (retries < 3 && !success) {
        try {
          data = await this.fetchPage(page);

          if (!data || !data.items || !Array.isArray(data.items)) {
            throw new Error(
              `Data items is not iterable. Raw data: ${JSON.stringify(data).substring(0, 500)}`,
            );
          }

          success = true;
        } catch (err) {
          retries++;
          this.logger.warn(
            `Error on page ${page} (Attempt ${retries}/3): .`,
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
          `Failed to fetch page ${page} after 3 attempts. Stopping sync loop.`,
        );
        break;
      }

      if (data.items.length === 0) {
        this.logger.log(
          `Page ${page} returned empty items array. Sync complete!`,
        );
        break;
      }

      for (const item of data.items) {
        try {
          await this.upsertProduct(item);
          productsSynced++;
        } catch (err) {
          this.logger.error(
            `Failed on product ${item?.catalogReference}}`,
          );
        }
      }
      this.logger.log(
        `Page ${page} done. Total products synced so far: ${productsSynced}`,
      );

      page++;
      // Play it safe: 2 second pause between healthy requests
      await new Promise((r) => setTimeout(r, 2000));
    }

    await this.toptexRepo.upsertSetting(
      'toptex_last_sync',
      startedAt.toISOString(),
    );
    this.logger.log(
      `=== Sync complete. ${productsSynced} products processed ===`,
    );

    return {
      message: `Full sync complete with database refresh.`,
      productsSynced: productsSynced,
    };
  }

  private async fetchPage(
    page: number,
  ): Promise<{ items: any[]; total_count: number }> {
    // Token appending is handled inside toptexApi service via Axios interceptor
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
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
      { code: 'de', name: 'Deutsch' },
      { code: 'nl', name: 'Nederlands' },
    ];
    for (const lang of languages) {
      await this.toptexRepo.upsertLanguage(lang.code, lang.name);
    }
  }

  private async upsertCategory(
    nameByLang: Record<string, string>,
    parentId: string | null,
  ): Promise<string> {
    const slug = slugify(
      nameByLang['en'] || nameByLang['fr'] || Object.values(nameByLang)[0],
    );
    const categoryId = await this.toptexRepo.upsertCategory(slug, parentId);

    // Upsert translations
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

  private async upsertProduct(item: any): Promise<void> {
    const ref = item.catalogReference;
    this.logger.log(`Saving product ${ref}...`);

    // 5a. Product row
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

    // 5b. Translations
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

    // 5c. Categories
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

    // 5d. Images
    const images: any[] = item.images || [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (!img.image_id) continue;

      const existing = await this.toptexRepo.findProductImageById(
        parseInt(img.image_id),
      );
      const payload = {
        urlImage: img.url_image || '',
        urlAuthenticated: img.url || null,
        isMain: i === 0,
        lastUpdate: parseDate(img.last_update),
      };

      if (existing) {
        await this.toptexRepo.updateProductImage(existing.id, payload);
      } else {
        await this.toptexRepo.createProductImage({
          productId: product.id,
          imageId: parseInt(img.image_id),
          ...payload,
        });
      }
    }

    // 5e. Colors / Skus
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

      // Packshots
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
          urlAuthenticated: psData.url || null,
          lastUpdate: parseDate(psData.last_update),
        };

        if (pExisting) {
          await this.toptexRepo.updateColorPackshot(pExisting.id, psPayload);
        } else {
          await this.toptexRepo.createColorPackshot({
            colorId: color.id,
            angleName: angle,
            ...psPayload,
          });
        }
      }

      // Skus
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
            sizeItem.isDiscontinued === 1 || sizeItem.isDiscontinued === true,
          saleState: sizeItem.saleState || 'active',
        });
      }
    }
  }
}
