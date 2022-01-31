import fetch from 'node-fetch';

export interface Story {
  title: string;
  image: string;
  author: string;
  story: Array<Array<string>>;
  category: string;
  link: string;
}

export type StoryCache = Record<string, Story>;

export async function getRandomStory(): Promise<Story> {
  const rawdata = await fetch('http://beipacket.org/cache/storyData.json');
  const parsedData = (await rawdata.json()) as Record<string, Story>;
  const keys = Object.keys(parsedData);
  const randomStoryIndex = Math.floor(Math.random() * keys.length);
  return parsedData[keys[randomStoryIndex]];
}

export async function getRandomStoryByCategory(category: string): Promise<Story> {
  const rawTitles = await fetch('http://beipacket.org/cache/storyTitles.json');
  const parsedData = (await rawTitles.json()) as Record<string, string[]>;
  if (!parsedData[category]) throw new Error('Category Does Not Exist');

  const allStoriesofCategory = parsedData[category];
  const randomStory = allStoriesofCategory[Math.floor(Math.random() * allStoriesofCategory.length)];

  const rawStories = await fetch('https://beipacket.org/cache/storyData.json');
  const parsedStories = (await rawStories.json()) as Record<string, Story>;
  return parsedStories[randomStory];
}

export async function getStoryByName(title: string): Promise<Story> {
  const rawdata = await fetch('http://beipacket.org/cache/storyData.json');
  const parsedData = (await rawdata.json()) as Record<string, Story>;
  if (!parsedData[title]) throw new Error('Story Does not exist');

  return parsedData[title];
}

export async function getAllStoryNames(): Promise<Array<string>> {
  const rawdata = await fetch('http://beipacket.org/cache/storyData.json');
  const parsedData = (await rawdata.json()) as Record<string, Story>;
  return Object.keys(parsedData);
}

export async function getAllStoriesNamesInCategory(category: string): Promise<Array<string>> {
  const rawTitles = await fetch('http://beipacket.org/cache/storyTitles.json');
  const parsedData = (await rawTitles.json()) as Record<string, string[]>;
  if (!parsedData[category]) throw new Error('Category Does Not Exist');

  return parsedData[category];
}

export async function getAllCategories(): Promise<Array<string>> {
  const rawTitles = await fetch('http://beipacket.org/cache/storyTitles.json');
  const parsedData = (await rawTitles.json()) as Record<string, string[]>;
  return Object.keys(parsedData);
}
