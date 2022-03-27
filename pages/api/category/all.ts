import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../services/db';
import CategoryResponse from './types/CategoryResponse';

export default async (
  _req: NextApiRequest,
  res: NextApiResponse<CategoryResponse>
) => {
  try {
    const categories = await prisma.category.findMany();
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({
      error: 'An error occurred retrieving categories from the database'
    });
  }
};
