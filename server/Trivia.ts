import { google } from 'googleapis';
import { auth } from './auth';
import { questionCacheRefreshTime } from "../globals"
import fs from "fs";

export interface Question {
    Volunteer: string;
    Difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Extra Hard';
    Categories?: string[];
    Question: string;
    Answer: string;
}

export async function getTriviaQuestions(): Promise<Question[]> {

    let data: Question[];

    try{
        let stats = fs.statSync('server/cache/questionCache.json');
        if (!stats == undefined || new Date().getTime() > new Date(stats.ctime).getTime() + questionCacheRefreshTime) {
            throw new Error("Revalidate Cache")
        } else {
            data = await getTriviaQuestionsFromCache();
        }
    } catch (err)
    {
        data = await getTriviaQuestionsFromSheets();
    }

    return data
}






async function getTriviaQuestionsFromCache(): Promise<Question[]> {

    const rawdata = fs.readFileSync('server/cache/questionCache.json')
    const parsedData = JSON.parse(rawdata.toString()) ?? await getTriviaQuestionsFromSheets()
    return parsedData
}


/**
 * Fetches the question data from google sheets and caches the results
 */
async function getTriviaQuestionsFromSheets(): Promise<Question[]> {
    const sheetsApi = google.sheets({ version: 'v4'})

    const { data: {values: [keys, ...values]}} = await sheetsApi.spreadsheets.values.get({
        auth: await auth(),
        spreadsheetId: '1l01y0fYhnlobHzra1HazzDJirgdrq8wej-G-7ZWRYss',
        range: 'Sheet1',
    })

    const typedQuestions: Question[] = values.map((row) => {
        return {
            Volunteer: row[0],
            Difficulty: row[1],
            Categories: row[2],
            Question: row[3],
            Answer: row[4],
        }
    })

    let json = JSON.stringify(typedQuestions)

    fs.writeFile('server/cache/questionCache.json', json, (err) => {
        if(err){
            console.log(err)
            return
        }
        console.log(`Question Cache has been created: ${(new Date()).toUTCString()}`)
    })

    console.log(typedQuestions)

    return typedQuestions
}