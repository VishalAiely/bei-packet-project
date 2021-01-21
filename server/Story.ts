import fs from 'fs';

export interface Story {
  title: string;
  image: string;
  author: string;
  story: Array<Array<string>>;
  category: string;
  link: string;
}

export type StoryCache = Record<string, Story>;

export function getRandomStory(): Story {
  const rawdata = fs.readFileSync('server/cache/storyData.json');
  const parsedData = JSON.parse(rawdata.toString()) as Record<string, Story>;
  const keys = Object.keys(parsedData);
  const randomStoryIndex = Math.floor(Math.random() * keys.length);
  return parsedData[keys[randomStoryIndex]];
}

export function getRandomStoryByCategory(category: string): Story {
  const rawTitles = fs.readFileSync('server/cache/storyTitles.json');
  const parsedData = JSON.parse(rawTitles.toString()) as Record<string, string[]>;
  if (!parsedData[category]) throw new Error('Category Does Not Exist');

  const allStoriesofCategory = parsedData[category];
  const randomStory = allStoriesofCategory[Math.floor(Math.random() * allStoriesofCategory.length)];

  const rawStories = fs.readFileSync('server/cache/storyData.json');
  const parsedStories = JSON.parse(rawStories.toString()) as Record<string, Story>;
  return parsedStories[randomStory];
}

export function getStoryByName(title: string): Story {
  const rawdata = fs.readFileSync('server/cache/storyData.json');
  const parsedData = JSON.parse(rawdata.toString()) as Record<string, Story>;
  if (!parsedData[title]) throw new Error('Story Does not exist');

  return parsedData[title];
}

export function getAllStoryNames(): Array<string> {
  const rawdata = fs.readFileSync('server/cache/storyData.json');
  const parsedData = JSON.parse(rawdata.toString()) as Record<string, Story>;
  return Object.keys(parsedData);
}

export function getAllStoriesNamesInCategory(category: string): Array<string> {
  const rawTitles = fs.readFileSync('server/cache/storyTitles.json');
  const parsedData = JSON.parse(rawTitles.toString()) as Record<string, string[]>;
  if (!parsedData[category]) throw new Error('Category Does Not Exist');

  return parsedData[category];
}

export function getAllCategories(): Array<string> {
  const rawdata = fs.readFileSync('server/cache/storyTitles.json');
  const parsedData = JSON.parse(rawdata.toString()) as Record<string, string[]>;
  return Object.keys(parsedData);
}
