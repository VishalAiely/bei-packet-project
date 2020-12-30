export enum Difficulty {
  Very_Easy = 1,
  Easy = 2,
  Medium = 3,
  Hard = 4,
}

export function StringToDifficulty(str: string): Difficulty | undefined {
  let diff: Difficulty | undefined;
  switch (str) {
    case 'Very Easy':
      diff = Difficulty.Very_Easy;
      break;
    case 'Easy':
      diff = Difficulty.Easy;
      break;
    case 'Medium':
      diff = Difficulty.Medium;
      break;
    case 'Hard':
      diff = Difficulty.Hard;
      break;
    default:
      diff = undefined;
      break;
  }
  return diff;
}

export interface Question {
  Id: number;
  Volunteer: string;
  Difficulty: Difficulty;
  Categories: string[];
  Question: string;
  Answer: string;
}

export interface TriviaOptions {
  Difficulty: Difficulty;
  Categories: string[];
  NumberofQuestions: number;
  StrictCategory: boolean;
}
