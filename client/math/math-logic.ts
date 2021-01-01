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
  if (operations.length < 1) {
    throw new Error('Not enough operations provided');
  }

  const prob: MathProblem = {
    firstOperand: Math.floor(Math.random() * maxNumber),
    secondOperand: Math.floor(Math.random() * maxNumber),
    operation: operations[Math.floor(Math.random() * operations.length)],
    answer: -1,
  };

  switch (prob.operation) {
    case '+':
      prob.answer = prob.firstOperand + prob.secondOperand;
      break;
    case '-':
      prob.answer = prob.firstOperand - prob.firstOperand;
      break;
    case '*':
      prob.answer = prob.firstOperand * prob.secondOperand;
      break;
    case '/':
      prob.answer = prob.firstOperand / prob.secondOperand;
      break;
  }

  return prob;
}

export function getAllRandomMathProblems(options: MathOptions): MathProblem[] {
  throw new Error('Not Implemented');
}
