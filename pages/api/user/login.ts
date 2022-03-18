import { prisma } from '../../../services/db';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { LoginRequest, LoginResponse } from '../../../types';
import { generateAuthToken } from '../../../utils/jwt';

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

        return res.status(200).json({
          authToken
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
