import requests
import time
from bs4 import BeautifulSoup

def get_track_src(url):
    try:
        response = requests.get(url)
        time.sleep(20)
        
        response = requests.get(url)
        if response.status_code == 200:
            with open("stuff.html", 'w', encoding='utf-8') as file:
                file.write(response.text)
            '''soup = BeautifulSoup(response.content, 'html.parser')
            track_element = soup.find('track')
            if track_element:
                track_src = track_element.get('src')
                return track_src
            else:
                print("No track element found in the HTML.")'''
        else:
            print(f"Failed to fetch URL. Status code: {response.status_code}")
    except Exception as e:
        print(f"An error occurred: {e}")

url = "https://podcast.ucsd.edu/watch/sp24/cse21_a01"
track_src = get_track_src(url)
if track_src:
    print(f"The track source URL is: {track_src}")
