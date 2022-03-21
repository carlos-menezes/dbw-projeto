import { User } from '@prisma/client';

type LoginResponse = {
  user?: User;
  message?: string;
};

export default LoginResponse;
