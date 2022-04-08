import { Ticket } from '@prisma/client';

type TicketUpdateRequest = {
  id: string;
  data: Ticket;
};

export default TicketUpdateRequest;
