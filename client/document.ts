import { Document, Packer, Paragraph, TextRun } from 'docx';
import { TriviaOptions, Question } from 'utils/types/Trivia';
import { saveAs } from 'file-saver';
import urls from 'utils/urls';

export async function GenerateDocx() {
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

export default class DocumentGenerator {
  makeDoc(Options: TriviaOptions): Document {
    const document = new Document();

    return document;
  }
}
