import { Document, Packer, Paragraph, TextRun } from 'docx';
import { TriviaOptions, Question, Difficulty } from 'utils/types/Trivia';
import { MathOptions, MathProblem, getAllRandomMathProblems } from 'client/math/math-logic';
import { saveAs } from 'file-saver';
import urls from 'utils/urls';

export async function GenerateDocx(): Promise<void> {
  const doc = new Document();

  const resp = await fetch(urls.api.trivia, {
    method: 'GET',
  });

  const questions = <Question[]>await resp.json();

  doc.addSection({
    properties: {},
    children: questions.map(
      question =>
        new Paragraph({
          children: [new TextRun(question.Question)],
        })
    ),

    // new Paragraph({
    //   children: [
    //     new TextRun('Hello World'),
    //     new TextRun({
    //       text: 'Foo Bar',
    //       bold: true,
    //     }),
    //     new TextRun({
    //       text: '\tGithub is the best',
    //       bold: true,
    //     }),
    //   ],
    // }),
  });

  console.log('downlaoding file');
  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'test.docx');
}

const defaultMathOps: MathOptions = {
  maxNumber: 9,
  numberofQuestions: 20,
  operations: ['+', '-'],
};

const defaultTriviaOps: TriviaOptions = {
  Difficulty: Difficulty.Easy,
  NumberofQuestions: 7,
  Categories: [],
  StrictCategory: false,
};

export default class DocumentGenerator {
  // Options and Docs
  private mainDoc: Document;
  private triviaOptions: TriviaOptions;
  private mathOptions: MathOptions;

  // Store Questions
  private triviaQuestions: Question[];
  private mathQuestions: MathProblem[];

  constructor(triviaOp?: TriviaOptions, mathOp?: MathOptions) {
    // Initial Setup
    this.mainDoc = new Document();
    this.triviaOptions = triviaOp || defaultTriviaOps;
    this.mathOptions = mathOp || defaultMathOps;

    // Initialize Storage of questions
    this.triviaQuestions = [];
    this.mathQuestions = [];
  }

  setTriviaOptions(options: TriviaOptions): void {
    this.triviaOptions = options;
  }

  setMathOptions(options: MathOptions): void {
    this.mathOptions = options;
  }

  async genTriviaQuestions(): Promise<Question[]> {
    const questions = await fetch(urls.api.trivia, {
      method: 'POST',
      body: JSON.stringify(this.triviaOptions),
    });

    const parsedQuestions = (await questions.json()) as Question[];

    this.triviaQuestions = parsedQuestions;

    return this.triviaQuestions;
  }

  genMathQuestions(): MathProblem[] {
    this.mathQuestions = getAllRandomMathProblems(this.mathOptions);

    return this.mathQuestions;
  }

  makeDoc(): Document {
    return this.mainDoc;
  }

  async downloadDoc(): Promise<void> {
    const blob = await Packer.toBlob(this.mainDoc);
    saveAs(blob, 'QuestionPacket.docx');
  }
}
