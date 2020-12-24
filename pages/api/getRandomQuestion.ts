import { NextApiRequest, NextApiResponse } from "next";
import { getTriviaQuestions } from "../../server/Trivia";

export default async function handler(req: NextApiRequest, res: NextApiResponse){

    const questions = await getTriviaQuestions()

    let index = Math.floor(Math.random() * questions.length)

    let question = questions[index]

    res.status(200).json(question)
}