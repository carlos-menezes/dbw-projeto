import { NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies';
import { AUTH_TOKEN } from '../../../utils/constants';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { [AUTH_TOKEN]: token } = nookies.get({ req });
  if (token) {
    nookies.destroy({ res }, AUTH_TOKEN, {
      path: '/'
    });
    return res.status(200).end();
  }

  return res.status(401).json({
    message: 'Token not found'
  });
};

export default handler;
