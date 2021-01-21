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

const factors = (number: number) => Array.from(Array(number + 1), (_, i) => i).filter(i => number % i === 0);

export function getRandomMathProblem(operations: operation[], maxNumber: number): MathProblem {
  if (operations.length < 1) {
    throw new Error('Not enough operations provided');
  }

  const prob: MathProblem = {
    firstOperand: Math.floor(Math.random() * maxNumber + 1),
    secondOperand: Math.floor(Math.random() * maxNumber + 1),
    operation: operations[Math.floor(Math.random() * operations.length)],
    answer: NaN,
  };

  let facts: number[] = [];

  switch (prob.operation) {
    case '+':
      prob.answer = prob.firstOperand + prob.secondOperand;
      break;
    case '-':
      [prob.firstOperand, prob.secondOperand] =
        prob.firstOperand < prob.secondOperand
          ? [prob.secondOperand, prob.firstOperand]
          : [prob.firstOperand, prob.secondOperand];
      prob.answer = prob.firstOperand - prob.firstOperand;
      break;
    case '*':
      prob.answer = prob.firstOperand * prob.secondOperand;
      break;
    case '/':
      [prob.firstOperand, prob.secondOperand] =
        prob.firstOperand < prob.secondOperand
          ? [prob.secondOperand, prob.firstOperand]
          : [prob.firstOperand, prob.secondOperand];

      if (prob.firstOperand === 1) prob.firstOperand += Math.floor(Math.random() * maxNumber);

      facts = factors(prob.firstOperand);
      while (facts.length <= 2 && maxNumber > 3) {
        prob.firstOperand = Math.floor(Math.random() * maxNumber + 1);
        facts = factors(prob.firstOperand);
      }
      prob.secondOperand = facts[Math.floor(Math.random() * facts.length)];
      prob.answer = prob.firstOperand / prob.secondOperand;
      break;
  }

  return prob;
}

export function getAllRandomMathProblems(options: MathOptions): MathProblem[] {
  const arrayOfProblems: MathProblem[] = [];

  for (let i = 0; i < options.numberofQuestions; i++) {
    arrayOfProblems.push(getRandomMathProblem(options.operations, options.maxNumber));
  }

  return arrayOfProblems;
}
