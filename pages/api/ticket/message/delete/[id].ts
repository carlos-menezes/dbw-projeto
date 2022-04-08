import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../../../services/db';
import TicketMessageDeleteResponse from '../../types/TicketMessageDeleteResponse';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<TicketMessageDeleteResponse>
) => {
  const id = req.query.id as string;
  try {
    await prisma.ticketMessage.delete({
      where: {
        id
      }
    });

    return res.status(200).end();
  } catch (e) {
    return res.status(500).json({
      error: 'An error occurred deleting the ticket message from the database'
    });
  }
};
