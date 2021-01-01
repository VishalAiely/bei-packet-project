type operations = '+' | '-' | '*' | '/';

export interface MathOptions {
  numberofQuestions: number;
  operations: operations[];
}

export default class MathDocument {
  makeDoc(Options: MathOptions): Document {
    const document = new Document();

    return document;
  }
}
