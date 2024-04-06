import re
import openai
import requests

openai.api_key = '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'

def fetch_lecture_transcript(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.text
        else:
            print("Failed to fetch lecture transcript from the provided URL.")
            return None
    except Exception as e:
        print("An error occurred while fetching lecture transcript:", e)
        return None

url = input("Please enter the URL containing the lecture transcript: ")

lecture_transcript = fetch_lecture_transcript(url)
if lecture_transcript:
    print("Lecture transcript fetched successfully.")
else:
    exit()

regex = r'^[\d\n].*\n'


txt = re.sub(regex, '', lecture_transcript, flags = re.MULTILINE)
def generate_response(query, context):
    prompt = context + "\nQuestion: " + query + "\nAnswer:"
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": context},
            {"role": "user", "content": query}
        ]
    )
    return response['choices'][0]['message']['content']

print("Ask a question (type 'exit' to end):")
while True:
    user_input = input("You: ")
    if user_input.lower() == 'exit':
        break
    response = generate_response(user_input, txt)
    print("Chatbot:", response)