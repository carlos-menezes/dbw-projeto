import { prisma } from './../../../services/db';
import { NextApiRequest, NextApiResponse } from 'next';
import ChatCreateRequest from './types/ChatCreateRequest';
import ChatCreateResponse from './types/ChatCreateResponse';

interface ChatCreateBody extends NextApiRequest {
  body: ChatCreateRequest;
}

export default async (
  req: ChatCreateBody,
  res: NextApiResponse<ChatCreateResponse>
) => {
  const { title, categoryId } = req.body;
  try {
    const { id } = await prisma.room.create({
      data: {
        title,
        categoryId
      }
    });

    return res.status(200).json({
      id
    });
  } catch (error) {
    return res.status(400).json({
      error: 'An error occurred creating a chat room'
    });
  }
};
