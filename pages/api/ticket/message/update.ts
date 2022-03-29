import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../../services/db';
import TicketMessageUpdateRequest from '../types/TicketMessageUpdateRequest';
import TicketMessageUpdateResponse from '../types/TicketMessageUpdateResponse';

interface TicketMessageUpdateBody extends NextApiRequest {
  body: TicketMessageUpdateRequest;
}

export default async (
  req: TicketMessageUpdateBody,
  res: NextApiResponse<TicketMessageUpdateResponse>
) => {
  const { ticketId, data, messageId } = req.body;
  try {
    // Remove previous replies
    await prisma.ticketMessage.updateMany({
      where: {
        ticketId
      },
      data: {
        isReply: false
      }
    });

    await prisma.ticketMessage.update({
      where: {
        id: messageId
      },
      data,
      select: {
        Ticket: true
      }
    });
    return res.status(200).end();
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      error: 'An error occurred updating the ticket message in the database'
    });
  }
};
