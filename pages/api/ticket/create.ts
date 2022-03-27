import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../services/db';
import { Prisma } from '@prisma/client';
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
    let data: Prisma.TicketCreateInput = {
      title,
      email,
      description,
      category: {
        connect: {
          id: categoryId
        }
      }
    };

    // Only create a `File` entry if a file has been passed into the body
    if (fileData) {
      data.file.create.data = fileData;
    }

    const { id } = await prisma.ticket.create({
      data
    });

    return res.status(200).json({
      id
    });
  } catch (e) {
    return res.status(500).json({
      error: 'An error occurred inserting the ticket in the database'
    });
  }
};
