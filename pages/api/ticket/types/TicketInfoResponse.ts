import { Category, Ticket, TicketMessage } from '@prisma/client';

type TicketInfoResponse = {
  ticket?: Ticket & { messages: TicketMessage[] } & { category: Category };
  error?: string;
};

export default TicketInfoResponse;
