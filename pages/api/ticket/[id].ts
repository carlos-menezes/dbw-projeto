import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../services/db';
import TicketInfoResponse from './types/TicketInfoResponse';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<TicketInfoResponse>
) => {
  const { id } = req.query;
  try {
    const ticket = await prisma.ticket.findUnique({
      where: {
        id: id as string
      },
      include: {
        category: true,
        messages: {
          include: {
            user: true
          }
        }
      }
    });

    return res.status(200).json({
      ticket
    });
  } catch (e) {
    console.log(e);

    return res.status(400).json({
      error: 'Ticket not found.'
    });
  }
};
