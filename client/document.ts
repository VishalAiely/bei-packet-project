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
import { Story } from 'server/Story';

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

export type sections = 'Trivia' | 'Math' | 'Reading' | '';

export default class DocumentGenerator {
  // Options and Docs
  private mainDoc: Document;
  private triviaOptions: TriviaOptions;
  private triviaVerbal: boolean;
  private mathOptions: MathOptions;

  // Store Questions
  public triviaQuestions: Question[];
  public mathQuestions: MathProblem[];
  public storyData: Story;

  constructor(triviaOp?: TriviaOptions, mathOp?: MathOptions) {
    // Initial Setup
    this.mainDoc = new Document();
    this.triviaOptions = triviaOp || defaultTriviaOps;
    this.triviaVerbal = false;
    this.mathOptions = mathOp || defaultMathOps;

    // Initialize Storage of questions
    this.triviaQuestions = [];
    this.mathQuestions = [];
    this.storyData = {} as Story;
  }

  private getTableRows(Cells: TableCell[][]): TableRow[] {
    const rows: TableRow[] = [];
    for (const r of Cells) {
      rows.push(new TableRow({ children: r }));
    }
    return rows;
  }

  setTriviaOptions(options: TriviaOptions & { triviaVerbal: boolean }): void {
    this.triviaOptions = options;
    this.triviaVerbal = options.triviaVerbal;
  }

  getTriviaOptions(): TriviaOptions & { triviaVerbal: boolean } {
    return {
      ...this.triviaOptions,
      triviaVerbal: this.triviaVerbal,
    };
  }

  setMathOptions(options: MathOptions): void {
    this.mathOptions = options;
  }

  getMathOptions(): MathOptions {
    return this.mathOptions;
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

  async genReading(): Promise<Story> {
    const storyResp = await fetch(urls.api.story);
    this.storyData = <Story>await storyResp.json();
    return this.storyData;
  }

  async moreTriviaQuestions(resetQuestions: number[]): Promise<Question[]> {
    const newQuestions = await fetch(urls.api.trivia, {
      method: 'POST',
      body: JSON.stringify({
        Difficulty: this.triviaOptions.Difficulty,
        NumberofQuestions: resetQuestions.length,
        Categories: this.triviaOptions.Categories,
        StrictCategory: this.triviaOptions.StrictCategory,
      }),
    });

    const parsedQuestions = (await newQuestions.json()) as Question[];

    for (let i = 0; i < resetQuestions.length; i++) this.triviaQuestions[resetQuestions[i]] = parsedQuestions[i];

    return this.triviaQuestions;
  }

  makeTriviaSection(): void {
    const questionsParagrpahs: Paragraph[] = [];
    let index = 1;
    let para: Paragraph;
    for (const ques of this.triviaQuestions) {
      para = new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [new TextRun({ text: `${index}. ${ques.Question}`, size: 32, bold: true })],
      });
      questionsParagrpahs.push(para);
      questionsParagrpahs.push(new Paragraph(''));
      if (!this.triviaVerbal) {
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
      }
      if (!this.triviaVerbal) {
        questionsParagrpahs.push(new Paragraph(''));
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
      }

      if (this.triviaQuestions.length !== index) {
        questionsParagrpahs.push(new Paragraph(''));
        questionsParagrpahs.push(new Paragraph(''));
        questionsParagrpahs.push(new Paragraph(''));
        index++;
      }
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
        ...questionsParagrpahs,
      ],
    });
  }

  makeMathSection(): void {
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
  }

  makeReadingSection(): void {
    this.mainDoc.addSection({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: this.storyData.title,
              bold: true,
              size: 48,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `By ${this.storyData.author}`, size: 32 })],
        }),
        new Paragraph(''),
        ...this.storyData.paragraphs.map(para => {
          return new Paragraph({
            spacing: {
              before: 200,
            },
            children: [new TextRun({ text: para, size: 28 })],
          });
        }),
      ],
    });
  }

  makeDoc(sectionOrder: sections[]): Document {
    this.mainDoc = new Document();

    const sectionMap = {
      Trivia: () => {
        this.makeTriviaSection();
      },
      Math: () => {
        this.makeMathSection();
      },
      Reading: () => {
        this.makeReadingSection();
      },
      '': () => {
        console.log('no section');
      },
    };

    for (const section of sectionOrder) {
      sectionMap[section]();
    }

    return this.mainDoc;
  }

  async downloadDoc(): Promise<void> {
    const blob = await Packer.toBlob(this.mainDoc);
    saveAs(blob, 'QuestionPacket.docx');
  }
}
