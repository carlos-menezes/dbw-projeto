import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../services/db';
import CreateQuickReplyRequest from './types/CreateQuickReplyRequest';

interface CreateQuickReplyRequestBody extends NextApiRequest {
  body: CreateQuickReplyRequest;
}

const handler = async (
  req: CreateQuickReplyRequestBody,
  res: NextApiResponse
) => {
  const { reply, user } = req.body;
  try {
    await prisma.quickReply.create({
      data: {
        userId: user,
        description: reply
      }
    });
    return res.status(200).end();
  } catch (e) {
    console.log(e);

    return res.status(400).json({
      error: 'An error occurred inserting the quick reply in the database'
    });
  }
};

export default handler;
