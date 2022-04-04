import { NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies';
import { AUTH_TOKEN } from '../../../utils/constants';
import LogoutResponse from './types/LogoutResponse';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<LogoutResponse>
) => {
  const { [AUTH_TOKEN]: token } = nookies.get({ req });
  if (token) {
    nookies.destroy({ res }, AUTH_TOKEN, {
      path: '/'
    });
    return res.status(200).end();
  }

  return res.status(401).json({
    error: 'Token not found'
  });
};
