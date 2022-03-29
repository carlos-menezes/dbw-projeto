import { Category, Ticket, TicketMessage } from '@prisma/client';

type TicketUpdateResponse = {
  ticket?: Ticket & { messages: TicketMessage[] } & { category: Category };
  error?: string;
};

export default TicketUpdateResponse;
