type TicketCreateRequest = {
  title: string;
  description: string;
  email: string;
  categoryId: string;
  fileData?: string;
};

export default TicketCreateRequest;
