import { TicketMessage } from '@prisma/client';

type TicketMessageUpdateRequest = {
  ticketId: string;
  messageId: string;
  data: TicketMessage;
};

export default TicketMessageUpdateRequest;
