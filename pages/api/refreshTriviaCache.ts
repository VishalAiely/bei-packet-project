import { NextApiRequest, NextApiResponse } from 'next';
import { getTriviaQuestionsFromSheets } from '../../server/Trivia';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (process.env.NODE_ENV !== 'development')
    res.status(400).json({ success: false, message: 'Only run on development to update cache' });
  else res.status(200).json(await getTriviaQuestionsFromSheets());
}
