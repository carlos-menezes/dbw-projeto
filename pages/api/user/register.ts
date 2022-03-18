import { prisma } from '../../../services/db';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { RegisterRequest, RegisterResponse } from '../../../types';

interface RegisterRequestBody extends NextApiRequest {
  body: RegisterRequest;
}

const handler = async (
  req: RegisterRequestBody,
  res: NextApiResponse<RegisterResponse>
) => {
  const { email, firstName, lastName, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashedPassword
    }
  });
  return res.status(200).end();
};

export default handler;
