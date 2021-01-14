import { AlignmentType, Document, Packer, Paragraph, TextRun } from 'docx';
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
    // Trivia
    const questionsParagrpahs: Paragraph[] = [];
    let index = 1;
    let para: Paragraph;
    for (const ques of this.triviaQuestions) {
      para = new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: `${index}. ${ques.Question}`, size: 32, bold: true })],
      });
      questionsParagrpahs.push(para);
      questionsParagrpahs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: '_______________________________________________________',
              size: 32,
              bold: true,
            }),
          ],
        })
      );
      questionsParagrpahs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: '_______________________________________________________',
              size: 32,
              bold: true,
            }),
          ],
        })
      );
      questionsParagrpahs.push(new Paragraph(''));
      questionsParagrpahs.push(new Paragraph(''));
      questionsParagrpahs.push(new Paragraph(''));
      index++;
    }

    this.mainDoc.addSection({
      properties: {},
      children: [
        // Trivia Header
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Trivia', bold: true, size: 48 })],
        }),
        new Paragraph({ children: [new TextRun('')] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Please write the question down first then the answer.', size: 32 })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: 'We are writing it down first because this activates the prefrontal cortex of the brain',
              size: 32,
            }),
          ],
        }),
        new Paragraph(''),
        new Paragraph(''),
        new Paragraph(''),
        ...questionsParagrpahs,
      ],
    });

    return this.mainDoc;
  }

  async downloadDoc(): Promise<void> {
    const blob = await Packer.toBlob(this.mainDoc);
    saveAs(blob, 'QuestionPacket.docx');
  }
}
