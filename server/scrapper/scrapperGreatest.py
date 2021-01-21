import requests
from bs4 import BeautifulSoup
import json
import threading
from nltk import tokenize

# Constants
STORY_DOMAIN = 'https://americanliterature.com'
GREAT_STORIES_URL = 'https://americanliterature.com/100-great-short-stories'
STORIES_FOR_CHILDREN = 'https://americanliterature.com/short-stories-for-children'
TEST_STORY_URL = '/author/kate-chopin/short-story/the-story-of-an-hour'
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

# Completed Stories
stories = {}
greatestStoryTitles = []
childrenStoryTitles = []

# Threads
threads = []

# Gets all of the story links
def getStoryLinks(Url, lookfor, parentElement):
    page = requests.get(Url)
    soup = BeautifulSoup(page.content, 'html.parser')
    results = soup.find_all('a')
    return [result.get('href') for result in results if (result.find_parent().name == parentElement and lookfor in result.get('href') and result.get('href').count("/") > 1)]

def getGreatestStoryInfo(lock, route):
    page = requests.get(STORY_DOMAIN+route)
    soup = BeautifulSoup(page.content, 'html.parser') 
    print(bcolors.WARNING + route + bcolors.ENDC)
    title = soup.find('cite').get_text()
    image = soup.find('figure').find_next('img').get('src')
    author = soup.find('h3').find('a').get_text()
    pStart = soup.find('hr').find_next('p')
    paragraphs = []
    while pStart.name != 'hr':
        if(pStart.name == 'p' and pStart.get_text() != ""):
            paragraphs.append(tokenize.sent_tokenize(pStart.get_text()))
        pStart = pStart.find_next()
    info = {
        "title": title,
        "image": image,
        "author": author,
        "story": paragraphs,
        "category": "Greatest",
        "link": STORY_DOMAIN+route
    }
    lock.acquire()
    global stories
    stories[title] = info
    greatestStoryTitles.append(title)
    lock.release()

def getChildrenStoryInfo(lock, route):
    page = requests.get(STORY_DOMAIN+route)
    soup = BeautifulSoup(page.content, 'html.parser')
    print(bcolors.WARNING + route + bcolors.ENDC)
    title = soup.find('cite').get_text()
    image = soup.find('hr').find_next('img').get('src')
    author = ''
    if('by' in soup.find('h3').get_text()):
        author = soup.find('h3').find('a').get_text()
    pStart = soup.find('hr').find_next('p')
    paragraphs = []
    while pStart.name != 'hr':
        if((pStart.name == 'p' or pStart.name == 'pre') and pStart.get_text() != ""):
            paragraphs.append(tokenize.sent_tokenize(pStart.get_text()))
        pStart = pStart.find_next()
    info = {
        "title": title,
        "image": image,
        "author": author,
        "story": paragraphs,
        "category": "Children",
        "link": STORY_DOMAIN+route
    }
    lock.acquire()
    global stories
    stories[title] = info
    childrenStoryTitles.append(title)
    lock.release()


ourLock = threading.Lock()
greastestLinks = getStoryLinks(GREAT_STORIES_URL, "/author/", "span") 
childrenLinks = getStoryLinks(STORIES_FOR_CHILDREN, "", "figure")

# getChildrenStoryInfo(ourLock, '/childrens-stories/hansel-and-gretel')
# print(stories)
# print(childrenStoryTitles)

for story in greastestLinks:
    # th = threading.Thread(target=getGreatestStoryInfo, args=(ourLock, story))
    # threads.append(th)
    # th.start()
    getGreatestStoryInfo(ourLock, story)

# for thread in threads:
#     thread.join()

# threads.clear()

for story in childrenLinks:
    # th = threading.Thread(target=getChildrenStoryInfo, args=(ourLock, story))
    # threads.append(th)
    # th.start()
    try:
        getChildrenStoryInfo(ourLock, story)
    except:
        print(bcolors.FAIL + 'Could not get info for ' + story + bcolors.ENDC)
    

# for thread in threads:
#     thread.join()

categories = {
    "Greatest": greatestStoryTitles,
    "Children": childrenStoryTitles
}

with open('../cache/storyData2.json', 'w') as f:
    json.dump(stories, f, indent=4)


with open('../cache/storyTitles.json', 'w') as f2:
    json.dump(categories, f2, indent=4)