import { prisma } from '../../../services/db';
import bcrypt from 'bcryptjs';
import {
  GetServerSideProps,
  GetStaticProps,
  NextApiRequest,
  NextApiResponse
} from 'next';
import { RegisterRequest, RegisterResponse } from '../../../types';
import nookies from 'nookies';
import { AUTH_TOKEN } from '../../../utils/constants';
import { generateAuthToken } from '../../../utils/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

interface RegisterRequestBody extends NextApiRequest {
  body: RegisterRequest;
}

export default async (
  req: RegisterRequestBody,
  res: NextApiResponse<RegisterResponse>
) => {
  const { email, firstName, lastName, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword
      }
    });

    const authToken = generateAuthToken({ user });
    nookies.set({ res }, AUTH_TOKEN, authToken, {
      path: '/',
      maxAge: 60 * 60 * 1 // 1h
    });
    return res.status(200).json({
      user
    });
  } catch (e) {
    return res.status(400).json({
      error: 'An user with that email already exists'
    });
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { [AUTH_TOKEN]: token } = nookies.get(context);

  console.log(token);

  return {
    props: {}
  };
};
