import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../services/db';
import QuestionAllResponse from './types/QuestionAllResponse';

export default async (
  _req: NextApiRequest,
  res: NextApiResponse<QuestionAllResponse>
) => {
  try {
    const questions = await prisma.question.findMany();
    return res.status(200).json({ questions });
  } catch (error) {
    return res.status(400).json({
      error: 'An error occurred retrieving questions from the database'
    });
  }
};
