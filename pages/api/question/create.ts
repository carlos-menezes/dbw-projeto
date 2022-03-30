import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../services/db';
import QuestionCreateRequest from './types/QuestionCreateRequest';
import QuestionCreateResponse from './types/QuestionCreateResponse';

interface QuestionRequestBody extends NextApiRequest {
  body: QuestionCreateRequest;
}

const handler = async (
  req: QuestionRequestBody,
  res: NextApiResponse<QuestionCreateResponse>
) => {
  const { title, description, categoryId } = req.body;
  try {
    const { id } = await prisma.question.create({
      data: {
        title,
        description,
        category: {
          connect: {
            id: categoryId
          }
        }
      }
    });
    return res.status(200).json({
      id
    });
  } catch (e) {
    return res.status(500).json({
      message: 'An error occurred inserting the question in the database'
    });
  }
};

export default handler;
