import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  ITableBordersOptions,
  WidthType,
} from 'docx';
import { TriviaOptions, Question, Difficulty } from 'utils/types/Trivia';
import { MathOptions, MathProblem, getAllRandomMathProblems } from 'client/math/math-logic';
import { saveAs } from 'file-saver';
import urls from 'utils/urls';

// Default Options
const defaultMathOps: MathOptions = {
  maxNumber: 9,
  numberofQuestions: 50,
  operations: ['+', '-'],
};

const defaultTriviaOps: TriviaOptions = {
  Difficulty: Difficulty.Easy,
  NumberofQuestions: 5,
  Categories: [],
  StrictCategory: false,
};

const emptyBorder: ITableBordersOptions = {
  top: {
    style: BorderStyle.NONE,
    size: 15,
    color: 'black',
  },
  bottom: {
    style: BorderStyle.NONE,
    size: 15,
    color: 'black',
  },
  left: {
    style: BorderStyle.NONE,
    size: 15,
    color: 'black',
  },
  right: {
    style: BorderStyle.NONE,
    size: 15,
    color: 'black',
  },
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

  private getTableRows(Cells: TableCell[][]): TableRow[] {
    const rows: TableRow[] = [];
    for (const r of Cells) {
      rows.push(new TableRow({ children: r }));
    }
    return rows;
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
    this.mainDoc = new Document();

    // Trivia
    const questionsParagrpahs: Paragraph[] = [];
    let index = 1;
    let para: Paragraph;
    for (const ques of this.triviaQuestions) {
      para = new Paragraph({
        alignment: AlignmentType.LEFT,
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

    // Math Section
    console.log(this.mathQuestions.length);
    const sectionedProblems: Array<TableCell[]> = new Array<TableCell[]>(Math.floor(this.mathQuestions.length / 3));
    for (let i = 0; i < this.mathQuestions.length; i++) {
      const currentQuestion = this.mathQuestions[i];
      const row = Math.floor(i / 3);
      if (!sectionedProblems[row]) sectionedProblems[row] = new Array<TableCell>();
      sectionedProblems[row].push(
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${currentQuestion.firstOperand} ${currentQuestion.operation} ${currentQuestion.secondOperand} = `,
                  size: 58,
                }),
              ],
            }),
          ],
          borders: emptyBorder,
          margins: {
            top: 20,
            bottom: 500,
            left: 20,
            right: 20,
          },
        })
      );
    }

    console.log(sectionedProblems);

    const table = new Table({
      alignment: AlignmentType.CENTER,
      rows: this.getTableRows(sectionedProblems),
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      columnWidths: [33, 33, 33],
    });

    this.mainDoc.addSection({ children: [table] });

    return this.mainDoc;
  }

  async downloadDoc(): Promise<void> {
    const blob = await Packer.toBlob(this.mainDoc);
    saveAs(blob, 'QuestionPacket.docx');
  }
}
