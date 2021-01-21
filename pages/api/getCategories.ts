import { NextApiRequest, NextApiResponse } from 'next';
import { getTriviaQuestions } from '../../server/Trivia';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const questions = await getTriviaQuestions();
  const categories = new Set<string>();
  for (const question of questions) {
    for (const category of question.Categories) {
      categories.add(category);
    }
  }
  res.status(200).json(Array.from(categories));
}
