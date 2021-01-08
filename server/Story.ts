import fs from 'fs';

export interface Story {
  title: string;
  image: string;
  author: string;
  paragrapgs: string[];
}

export function getRandomStory(): Story {
  const rawdata = fs.readFileSync('server/cache/storyData.json');
  const parsedData = JSON.parse(rawdata.toString()) as Story[];
  const randomStoryIndex = Math.floor(Math.random() * parsedData.length);
  return parsedData[randomStoryIndex];
}
