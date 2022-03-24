import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { TokenRequest, TokenResponse } from '../../../types';
import { verifyJWT } from '../../../utils/jwt';

interface TokenRequestBody extends NextApiRequest {
  body: TokenRequest;
}

export default async (
  req: TokenRequestBody,
  res: NextApiResponse<TokenResponse>
) => {
  const { token } = req.body;
  try {
    const {
      user: { id }
    } = verifyJWT(token) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    });

    return res.status(200).json({
      user
    });
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      return res.status(401).json({
        error: 'Token expired'
      });
    } else if (e instanceof JsonWebTokenError) {
      return res.status(401).json({
        error: 'Invalid token'
      });
    } else if (e instanceof PrismaClientKnownRequestError) {
      return res.status(400).json({
        error: 'Unknown user'
      });
    } else {
      const error = e as Error;
      throw new Error(error.message);
    }
  }
};
