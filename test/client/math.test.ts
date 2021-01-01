import { getRandomMathProblem, operation } from '../../client/math/math-logic';

describe('getAllRandomMathProblems', () => {
  it.todo('Math function gives me correct number of problems');
  it.todo('Are the math problems random enough?');
});

describe('getRandomMathProblem', () => {
  it('Math function returns all neccessary fields', () => {
    const problem = getRandomMathProblem(['+', '-'], 12);

    expect(problem.firstOperand).toBeDefined();
    expect(problem.secondOperand).toBeDefined();
    expect(problem.operation).toBeDefined();
    expect(problem.answer).toBeDefined();
  });
  it('Math function returns the correct answers for math problems', () => {
    const problem = getRandomMathProblem(['+', '-', '*', '/'], 25);

    let expectedAnswer: number | undefined = undefined;
    switch (problem.operation) {
      case '+':
        expectedAnswer = problem.firstOperand + problem.secondOperand;
        break;
      case '-':
        expectedAnswer = problem.firstOperand - problem.firstOperand;
        break;
      case '*':
        expectedAnswer = problem.firstOperand * problem.secondOperand;
        break;
      case '/':
        expectedAnswer = problem.firstOperand / problem.secondOperand;
        break;
    }

    expect(expectedAnswer).toBeDefined();
    expect(problem.answer).toBe(expectedAnswer);
  });
  it('Math function uses correct operator', () => {
    const ops: operation[] = ['*', '-'];
    const problem = getRandomMathProblem(ops, 18);

    expect(ops.includes(problem.operation)).toBeTruthy();
  });
  it('Math function does not include a number bigger than the max', () => {
    const maxNum = 30;

    const problem = getRandomMathProblem(['+', '-', '*', '/'], maxNum);

    expect(problem.firstOperand).toBeLessThanOrEqual(maxNum);
    expect(problem.secondOperand).toBeLessThanOrEqual(maxNum);
  });
});

export {};
