import { TicketMessage } from '@prisma/client';

type TicketMessageUpdateRequest = {
  id: string;
  data: TicketMessage;
};

export default TicketMessageUpdateRequest;
