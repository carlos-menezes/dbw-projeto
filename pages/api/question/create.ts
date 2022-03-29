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
  // } else if (req.method === 'PATCH') {
  //   const { id, title, description } = req.body;
  //   try {
  //     await prisma.question.update({
  //       where: {
  //         id
  //       },
  //       data: {
  //         title,
  //         description
  //       }
  //     });

  //     return res.status(200).json({
  //       id
  //     });
  //   } catch (e) {
  //     return res.status(500).json({
  //       message: 'An error occurred updating the question'
  //     });
  //   }
  // } else if (req.method === 'DELETE') {
  //   const { id } = req.body;
  //   try {
  //     await prisma.question.delete({
  //       where: {
  //         id
  //       }
  //     });

  //     return res.status(200).end();
  //   } catch (e) {
  //     return res.status(500).json({
  //       message: 'An error occurred deleting the question'
  //     });
  //   }
  // }
};

export default handler;
