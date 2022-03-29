import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies';

import { prisma } from '../../../services/db';
import { generateAuthToken } from '../../../utils/jwt';
import { AUTH_TOKEN } from '../../../utils/constants';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import LoginRequest from './types/LoginRequest';
import LoginResponse from './types/LoginResponse';

interface LoginRequestBody extends NextApiRequest {
  body: LoginRequest;
}

export default async (
  req: LoginRequestBody,
  res: NextApiResponse<LoginResponse>
) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email.'
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      const authToken = generateAuthToken({ user });
      nookies.set({ res }, AUTH_TOKEN, authToken, {
        path: '/',
        maxAge: 60 * 60 * 1 // 1h
      });
      return res.status(200).json({
        user
      });
    } else {
      return res.status(401).json({
        error: 'Invalid password.'
      });
    }
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw new Error('Missing field(s) `email` and/or `password`.');
    }
  }
};
