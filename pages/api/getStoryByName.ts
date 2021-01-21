import { NextApiRequest, NextApiResponse } from 'next';
import { getStoryByName } from 'server/Story';

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  try {
    if (req.method != 'POST') {
      throw new Error('This API only supports GET requests');
    }
    res.status(200).json(getStoryByName(req.body));
  } catch (error: unknown) {
    const err = error as Error;
    res.status(400).json({ success: false, message: err.message });
  }
}
