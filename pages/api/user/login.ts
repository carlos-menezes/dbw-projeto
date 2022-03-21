import { prisma } from '../../../services/db';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { LoginRequest, LoginResponse } from '../../../types';
import { generateAuthToken } from '../../../utils/jwt';
import nookies from 'nookies';
import { AUTH_TOKEN } from '../../../utils/constants';

interface LoginRequestBody extends NextApiRequest {
  body: LoginRequest;
}

const handler = async (
  req: LoginRequestBody,
  res: NextApiResponse<LoginResponse>
) => {
  const { email, password } = req.body;
  await prisma.user
    .findUnique({
      where: {
        email
      }
    })
    .then(async (user) => {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const authToken = generateAuthToken({ user });
        nookies.set({ res }, AUTH_TOKEN, authToken);

        return res.status(200).json({
          user
        });
      } else {
        return res.status(401).json({ message: 'Invalid password.' });
      }
    })
    .catch(() => {
      return res.status(401).json({ message: 'Invalid email.' });
    });
};

export default handler;
