import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../services/db';
import TicketUpdateRequest from './types/TicketUpdateRequest';
import TicketUpdateResponse from './types/TicketUpdateResponse';

interface TicketUpdateBody extends NextApiRequest {
  body: TicketUpdateRequest;
}

export default async (
  req: TicketUpdateBody,
  res: NextApiResponse<TicketUpdateResponse>
) => {
  const { id, data } = req.body;
  try {
    const ticket = await prisma.ticket.update({
      where: {
        id
      },
      data,
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
    return res.status(500).json({
      error: 'An error occurred updating the ticket in the database'
    });
  }
};
