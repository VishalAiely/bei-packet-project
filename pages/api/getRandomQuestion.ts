import { NextApiRequest, NextApiResponse } from 'next';
import { getTriviaQuestions } from '../../server/Trivia';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const questions = await getTriviaQuestions();

  const index = Math.floor(Math.random() * questions.length);

  const question = questions[index];

  res.status(200).json(question);
}
