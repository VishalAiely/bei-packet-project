import { NextApiRequest, NextApiResponse } from 'next';
import { getTriviaQuestions } from '../../server/Trivia';
import { TriviaOptions, Difficulty, Question, StringToDifficulty } from '../../utils/types/Trivia';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method != 'POST') {
    res.status(400).json({ message: 'This API only supports GET requests.' });
  }

  const opt = req.body as { [key: string]: unknown };

  let converted_diff: Difficulty | undefined;
  if (opt['Difficulty'] != undefined) {
    converted_diff = StringToDifficulty(<string>opt.Difficulty);
  }

  const Options: TriviaOptions = {
    Difficulty: converted_diff ?? Difficulty.Easy,
    Categories: <string[]>opt?.Categories ?? [],
    NumberofQuestions: <number>opt?.NumberofQuestions ?? 5,
    StrictCategory: <boolean>opt?.StrictCategory ?? false,
  };

  const finalQuestions: Question[] = [];
  const addedQuestionsIds = new Set<number>();
  const questions = await getTriviaQuestions();
  for (let x = 0; x < Options.Categories.length; x++) {
    Options.Categories[x] = Options.Categories[x].toLowerCase();
  }

  const correctDifficulty = questions.filter(quest => quest.Difficulty <= Options.Difficulty);

  // If categories are provided, we pull at most half of the final questions
  if (Options.Categories.length > 0) {
    const categoricalQuestions: Question[] = correctDifficulty.filter(quest =>
      quest.Categories.some(cate => Options.Categories.includes(cate))
    );

    // Any categories were found
    if (categoricalQuestions.length > 0) {
      let m = categoricalQuestions.length;
      let i: number;
      let end: Question;
      const numberofQuests = Options.StrictCategory ? Options.NumberofQuestions : Options.NumberofQuestions / 2;

      while (finalQuestions.length <= numberofQuests && m >= 0) {
        i = Math.floor(Math.random() * m--);
        finalQuestions.push(categoricalQuestions[i]);
        addedQuestionsIds.add(categoricalQuestions[i].Id);
        end = categoricalQuestions[m];
        categoricalQuestions[m] = categoricalQuestions[i];
        categoricalQuestions[i] = end;
      }
    }
  }

  // Adds the remaining questions of the correct difficulty
  let m = correctDifficulty.length;
  let i: number, end: Question;
  if (!Options.StrictCategory) {
    while (finalQuestions.length < Options.NumberofQuestions && m > 0) {
      i = Math.floor(Math.random() * m--);
      if (!addedQuestionsIds.has(correctDifficulty[i].Id)) {
        finalQuestions.push(correctDifficulty[i]);
        addedQuestionsIds.add(correctDifficulty[i].Id);
      }

      end = correctDifficulty[m];
      correctDifficulty[m] = correctDifficulty[i];
      correctDifficulty[i] = end;
    }
  }

  // Last Shuffle to move categorical questions around
  m = finalQuestions.length;
  while (m > 0) {
    i = Math.floor(Math.random() * m--);
    end = finalQuestions[m];
    finalQuestions[m] = finalQuestions[i];
    finalQuestions[i] = end;
  }

  res.status(200).json(finalQuestions);
  res.end();
}
