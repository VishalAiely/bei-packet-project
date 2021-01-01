export type operation = '+' | '-' | '*' | '/';

export interface MathOptions {
  numberofQuestions: number;
  operations: operation[];
  maxNumber: number;
}

export interface MathProblem {
  firstOperand: number;
  secondOperand: number;
  operation: operation;
  answer: number;
}

export function getRandomMathProblem(operations: operation[], maxNumber: number): MathProblem {
  throw new Error('Not Implemented');
}

export function getAllRandomMathProblems(options: MathOptions): MathProblem[] {
  throw new Error('Not Implemented');
}
