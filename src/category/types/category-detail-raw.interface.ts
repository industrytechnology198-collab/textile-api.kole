import { Translation } from '@prisma/client';

export interface CategoryBase {
  id: string;
  parentId: string | null;
  slug: string;
  translations?: Translation[];
}

export interface CategoryWithChildren extends CategoryBase {
  children: CategoryBase[];
}
