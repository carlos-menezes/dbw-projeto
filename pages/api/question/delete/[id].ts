import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../../services/db';
import QuestionDeleteResponse from '../types/QuestionDeleteResponse';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<QuestionDeleteResponse>
) => {
  const id = req.query.id as string;
  try {
    await prisma.question.delete({
      where: {
        id
      }
    });

    return res.status(200).end();
  } catch (e) {
    return res.status(500).json({
      error: 'An error occurred deleting the question from the database'
    });
  }
};

export default handler;
