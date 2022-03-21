import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies, setCookie } from "nookies";
import { AUTH_TOKEN } from "../../../utils/constants";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { [AUTH_TOKEN]: token } = parseCookies({ req });
  if (token) {
      setCookie({ res }, AUTH_TOKEN, "");
      return res.status(200);
  }

  return res.status(401).json({
      message: 'Token not found'
  })
};

export default handler;
