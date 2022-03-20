import { User } from '@prisma/client';

type LoginResponse = {
  authToken?: string;
  user?: User;
  message?: string;
};

export default LoginResponse;
