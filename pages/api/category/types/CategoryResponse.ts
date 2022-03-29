import { Category } from '@prisma/client';

type CategoryResponse = {
  categories?: Category[];
  error?: string;
};

export default CategoryResponse;
