import { NextApiRequest, NextApiResponse } from 'next';
import { getTriviaQuestionsFromSheets } from '../../server/Trivia';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  res.status(200).json(await getTriviaQuestionsFromSheets());
}
