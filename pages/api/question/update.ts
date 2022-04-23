import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../services/db';
import QuestionUpdateRequest from './types/QuestionUpdateRequest';
import QuestionUpdateResponse from './types/QuestionUpdateResponse';

interface QuestionUpdateBody extends NextApiRequest {
  body: QuestionUpdateRequest;
}

export default async (
  req: QuestionUpdateBody,
  res: NextApiResponse<QuestionUpdateResponse>
) => {
  const { id, data } = req.body;

  try {
    await prisma.question.update({
      where: {
        id
      },
      data
    });
    return res.status(200).end();
  } catch (e) {
    return res.status(400).json({
      error: 'An error occurred updating the question in the database'
    });
  }
};
