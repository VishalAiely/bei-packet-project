import { Document, Packer, Paragraph, TextRun } from "docx"
import { Difficulty, TriviaOptions, Question } from "../../util/types/Trivia";
import fs from 'fs'


export async function GenerateDocx() {

    const doc = new Document()

    doc.addSection({
        properties: {},
        children: [
            new Paragraph({
                children: [
                    new TextRun("Hello World"),
                    new TextRun({
                        text: "Foo Bar",
                        bold: true,
                    }),
                    new TextRun({
                        text: "\tGithub is the best",
                        bold: true,
                    }),
                ],
            }),
        ],
    });

    let buffer = await Packer.toBuffer(doc)
    fs.writeFileSync("MyDocument.docx", buffer);
}

export default class TriviaDocument {



    makeDoc(Options: TriviaOptions): Document {

        const document = new Document

        return document
    }

}
