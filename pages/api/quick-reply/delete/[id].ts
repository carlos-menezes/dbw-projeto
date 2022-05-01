import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../../services/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string;
  try {
    await prisma.quickReply.delete({
      where: {
        id
      }
    });
    return res.status(200).end();
  } catch (e) {
    console.log(e);

    return res.status(400).json({
      error: 'An error occurred deleting the quick reply from the database'
    });
  }
};

export default handler;
