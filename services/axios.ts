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
    baseURL: 'http://localhost:3000'
  });

  api.interceptors.request.use((config) => {
    return config;
  });

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  return api;
}
