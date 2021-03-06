import axios from 'axios';
import { NextApiRequest, NextPageContext } from 'next';
import { parseCookies } from 'nookies';

export function getAPIClient(
  ctx?:
    | Pick<NextPageContext, 'req'>
    | {
        req: NextApiRequest;
      }
    | null
    | undefined
) {
  const { 'dbw.token': token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: process.env.BASE_URL
  });

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  return api;
}
