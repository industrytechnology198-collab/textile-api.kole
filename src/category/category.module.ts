import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryTreeHandler } from './handlers/category-tree.handler';
import { CategoryRepository } from './repositories/category.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryTreeHandler, CategoryRepository],
})
export class CategoryModule {}
