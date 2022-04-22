import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../../services/db';
import TicketMessageCreateRequest from '../types/TicketMessageCreateRequest';
import TicketMessageCreateResponse from '../types/TicketMessageCreateResponse';

interface TicketMessageCreateBody extends NextApiRequest {
  body: TicketMessageCreateRequest;
}

export default async (
  req: TicketMessageCreateBody,
  res: NextApiResponse<TicketMessageCreateResponse>
) => {
  const { ticketId, message, userId } = req.body;
  try {
    await prisma.ticketMessage.create({
      data: {
        ticketId,
        message,
        userId
      }
    });
    return res.status(200).end();
  } catch (e) {
    return res.status(400).json({
      error: 'An error occurred inserting the ticket in the database'
    });
  }
};
