import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

type AuthTokenData = {
  user: User;
};

const generateAuthToken = ({ user }: AuthTokenData) =>
  jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });

const verifyJWT = (payload: string) => {
  return jwt.verify(payload, process.env.JWT_SECRET);
};

export { generateAuthToken, verifyJWT };
