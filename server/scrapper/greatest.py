import requests
from bs4 import BeautifulSoup
import json
import threading

# Constants
STORY_DOMAIN = 'https://americanliterature.com'
GREAT_STORIES_URL = 'https://americanliterature.com/100-great-short-stories'
TEST_STORY_URL = '/author/kate-chopin/short-story/the-story-of-an-hour'

# Completed Stories
stories = []

# Threads
threads = []

# Gets all of the story links
def getStoryLinks():
    page = requests.get(GREAT_STORIES_URL)
    soup = BeautifulSoup(page.content, 'html.parser')
    results = soup.find_all('a')
    return [result.get('href') for result in results if (result.find_parent().name == "span" and "/author/" in result.get('href'))]

def getStoryInfo(lock, route):
    page = requests.get(STORY_DOMAIN+route)
    soup = BeautifulSoup(page.content, 'html.parser') 
    title = soup.find('cite').get_text()
    image = soup.find('figure').find_next('img').get('src')
    author = soup.find('h3').find('a').get_text()
    pStart = soup.find('hr').find_next('p')
    paragraphs = []
    while pStart.name != 'hr':
        if(pStart.name == 'p' and pStart.get_text() != ""):
            paragraphs.append(pStart.get_text())
        pStart = pStart.find_next()
    global stories
    info = {
        "title": title,
        "image": image,
        "author": author,
        "paragraphs": paragraphs,
    }
    lock.acquire()
    stories.append(info)
    lock.release()


ourLock = threading.Lock()
links = getStoryLinks()

for story in links:
    th = threading.Thread(target=getStoryInfo, args=(ourLock, story))
    threads.append(th)
    th.start()

for thread in threads:
    thread.join()

with open('../cache/storyData.json', 'w') as f:
    json.dump(stories, f, indent=4)