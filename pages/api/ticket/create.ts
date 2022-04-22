import { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes } from 'crypto';

import { prisma } from '../../../services/db';
import TicketCreateRequest from './types/TicketCreateRequest';
import TicketCreateResponse from './types/TicketCreateResponse';

interface TicketCreateBody extends NextApiRequest {
  body: TicketCreateRequest;
}

export default async (
  req: TicketCreateBody,
  res: NextApiResponse<TicketCreateResponse>
) => {
  const { title, email, description, categoryId, fileData } = req.body;
  try {
    const { id, commentCode } = await prisma.ticket.create({
      data: {
        title,
        email,
        description,
        commentCode: randomBytes(3).toString('hex'),
        category: {
          connect: {
            id: categoryId
          }
        }
      }
    });

    return res.status(200).json({
      id,
      commentCode
    });
  } catch (e) {
    console.log(e);

    return res.status(400).json({
      error: 'An error occurred inserting the ticket in the database'
    });
  }
};
