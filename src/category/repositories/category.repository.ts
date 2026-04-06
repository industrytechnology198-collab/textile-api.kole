import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryWithChildren } from '../types/category-detail-raw.interface';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getTopLevelCategoriesWithActiveProducts() {
    const categories: CategoryWithChildren[] =
      await this.prisma.category.findMany({
        where: {
          parentId: null,
          // Must either directly have active products OR have a child with active products
          OR: [
            {
              products: {
                some: {
                  product: { saleState: 'active' },
                },
              },
            },
            {
              children: {
                some: {
                  products: {
                    some: {
                      product: { saleState: 'active' },
                    },
                  },
                },
              },
            },
          ],
        },
        include: {
          children: {
            where: {
              products: {
                some: {
                  product: { saleState: 'active' },
                },
              },
            },
          },
        },
      });

    if (!categories || categories.length === 0) return [];

    const allIds = new Set<string>();
    for (const cat of categories) {
      allIds.add(cat.id);
      for (const child of cat.children) {
        allIds.add(child.id);
      }
    }

    const translations = await this.prisma.translation.findMany({
      where: { entityId: { in: Array.from(allIds) } },
    });

    for (const cat of categories) {
      cat.translations = translations.filter((t) => t.entityId === cat.id);
      for (const child of cat.children) {
        child.translations = translations.filter(
          (t) => t.entityId === child.id,
        );
      }
    }

    return categories;
  }
}
