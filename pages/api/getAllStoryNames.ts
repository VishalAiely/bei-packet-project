import { NextApiRequest, NextApiResponse } from 'next';
import { getAllStoryNames } from 'server/Story';

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  try {
    if (req.method != 'GET') {
      throw new Error('This API only supports GET requests');
    }
    res.status(200).json(getAllStoryNames());
  } catch (error: unknown) {
    const err = error as Error;
    res.status(400).json({ success: false, message: err.message });
  }
}
