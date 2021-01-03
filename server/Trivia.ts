import { google } from 'googleapis';
import { auth } from './auth';
import { questionCacheRefreshTime } from '../globals';
import fs from 'fs';
import { Difficulty, Question } from '../utils/types/Trivia';

export async function getTriviaQuestions(): Promise<Question[]> {
  let data: Question[];

  try {
    const stats = fs.statSync('server/cache/questionCache.json');
    if (!stats == undefined || new Date().getTime() > new Date(stats.ctime).getTime() + questionCacheRefreshTime) {
      throw new Error('Revalidate Cache');
    } else {
      data = await getTriviaQuestionsFromCache();
    }
  } catch (err) {
    data = await getTriviaQuestionsFromSheets();
  }

  return data;
}

async function getTriviaQuestionsFromCache(): Promise<Question[]> {
  const rawdata = fs.readFileSync('server/cache/questionCache.json');
  const parsedData = (JSON.parse(rawdata.toString()) as Question[]) ?? (await getTriviaQuestionsFromSheets());
  return parsedData;
}

/**
 * Fetches the question data from google sheets and caches the results
 */
async function getTriviaQuestionsFromSheets(): Promise<Question[]> {
  const sheetsApi = google.sheets({ version: 'v4' });

  const {
    data: { values },
  } = await sheetsApi.spreadsheets.values.get({
    auth: await auth(),
    spreadsheetId: '1l01y0fYhnlobHzra1HazzDJirgdrq8wej-G-7ZWRYss',
    range: 'Sheet1',
  });

  // removes the keys
  values?.shift();

  const typedQuestions: Question[] =
    values?.map((row, ind) => {
      let diff: Difficulty;
      let cats: string[];

      switch (row[2] as string) {
        case 'Very Easy':
          diff = Difficulty.Very_Easy;
          break;
        case 'Easy':
          diff = Difficulty.Easy;
          break;
        case 'Medium':
          diff = Difficulty.Medium;
          break;
        case 'Hard':
          diff = Difficulty.Hard;
          break;
        default:
          diff = 0;
          break;
      }

      cats = (<string>row[2]).split(',');
      for (let i = 0; i < cats.length; i++) {
        cats[i] = cats[i].trim().toLowerCase();
      }

      if (cats[0] == '') cats = [];

      return {
        Id: ind,
        Volunteer: row[0] as string,
        Difficulty: diff,
        Categories: cats,
        Question: row[3] as string,
        Answer: row[4] as string,
      };
    }) || [];

  const json = JSON.stringify(typedQuestions);

  fs.writeFile('server/cache/questionCache.json', json, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Question Cache (size: ${typedQuestions.length}) has been created at ${new Date().toUTCString()}`);
  });

  return typedQuestions;
}
