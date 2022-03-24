import { prisma } from '../../../services/db';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { RegisterRequest, RegisterResponse } from '../../../types';
import nookies from 'nookies';
import { AUTH_TOKEN } from '../../../utils/constants';
import { generateAuthToken } from '../../../utils/jwt';

interface RegisterRequestBody extends NextApiRequest {
  body: RegisterRequest;
}

const handler = async (
  req: RegisterRequestBody,
  res: NextApiResponse<RegisterResponse>
) => {
  const { email, firstName, lastName, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashedPassword
    }
  });

  if (!user) {
    return res.status(400).json({
      error: 'An user with that email already exists'
    });
  }

  const authToken = generateAuthToken({ user });
  nookies.set({ res }, AUTH_TOKEN, authToken, {
    path: '/',
    maxAge: 60 * 60 * 1 // 1h
  });
  return res.status(200).json({
    user
  });
};

export default handler;
