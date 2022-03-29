import { User } from '@prisma/client';

type RegisterResponse = {
  user?: User;
  error?: string;
};

export default RegisterResponse;
