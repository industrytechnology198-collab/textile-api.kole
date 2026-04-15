import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ToptexRepository {
  private readonly logger = new Logger(ToptexRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async clearAllData(): Promise<void> {
    this.logger.warn('Clearing all synced toptex data...');
    // Delete in reverse dependency order to avoid foreign key violations safely
    await this.prisma.orderItem.deleteMany();
    await this.prisma.order.deleteMany();
    await this.prisma.cartItem.deleteMany();
    await this.prisma.cart.deleteMany();
    await this.prisma.review.deleteMany();

    await this.prisma.productSku.deleteMany();
    await this.prisma.colorPackshot.deleteMany();
    await this.prisma.productColor.deleteMany();
    await this.prisma.productImage.deleteMany();
    await this.prisma.productCategory.deleteMany();

    await this.prisma.translation.deleteMany();
    await this.prisma.product.deleteMany();
    await this.prisma.category.deleteMany();
    await this.prisma.language.deleteMany();

    await this.prisma.settings.deleteMany();
    this.logger.log('Database cleared completely.');
  }

  async upsertLanguage(code: string, name: string): Promise<void> {
    await this.prisma.language.upsert({
      where: { code },
      update: {},
      create: { code, name },
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

  async upsertProduct(ref: string, data: any): Promise<any> {
    return this.prisma.product.upsert({
      where: { catalogReference: ref },
      update: data,
      create: { catalogReference: ref, ...data },
    });
  }

  async findProductByRef(ref: string): Promise<any> {
    return this.prisma.product.findUnique({
      where: { catalogReference: ref },
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

  async findProductImageById(imageId: number): Promise<any> {
    return this.prisma.productImage.findFirst({
      where: { imageId },
    });
  }

  async updateProductImage(id: string, data: any): Promise<void> {
    await this.prisma.productImage.update({
      where: { id },
      data,
    });
  }

  async createProductImage(data: any): Promise<void> {
    await this.prisma.productImage.create({ data });
  }

  async upsertProductColor(
    productId: string,
    colorCode: string,
    data: any,
  ): Promise<any> {
    return this.prisma.productColor.upsert({
      where: { productId_colorCode: { productId, colorCode } },
      update: data,
      create: { productId, colorCode, ...data },
    });
  }

  async findColorPackshot(colorId: string, angleName: string): Promise<any> {
    return this.prisma.colorPackshot.findFirst({
      where: { colorId, angleName },
    });
  }

  async updateColorPackshot(id: string, data: any): Promise<void> {
    await this.prisma.colorPackshot.update({
      where: { id },
      data,
    });
  }

  async createColorPackshot(data: any): Promise<void> {
    await this.prisma.colorPackshot.create({ data });
  }

  async upsertProductSku(sku: string, data: any): Promise<void> {
    await this.prisma.productSku.upsert({
      where: { sku },
      update: data,
      create: { sku, ...data },
    });
  }

  async upsertSetting(key: string, value: string): Promise<void> {
    await this.prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
