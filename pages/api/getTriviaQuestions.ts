import { NextApiRequest, NextApiResponse } from 'next';
import { getTriviaQuestions } from '../../server/Trivia';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(await getTriviaQuestions());
}
