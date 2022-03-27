import { User } from '@prisma/client';

type TokenResponse = {
  user?: User;
  error?: string;
};

export default TokenResponse;
