import { User } from '@prisma/client';

type LoginResponse = {
  user?: User;
  error?: string;
};

export default LoginResponse;
