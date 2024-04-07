from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import openai
import requests
import sys

 
app = Flask(__name__)
CORS(app)


openai.api_key = 'API---KEY----HERE'

def fetch_lecture_transcript(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.text
        else:
            app.logger.info(response.text)
            print("Failed to fetch lecture transcript from the provided URL.")
            return None
    except Exception as e:
        print("An error occurred while fetching lecture transcript:", e)
        return None
    

@app.route('/fetch_transcript', methods=['POST'])
def fetch_transcript():
    content = request.json
    url = content['url']
    transcript = fetch_lecture_transcript(url)
    print(transcript, file=sys.stderr)
    if transcript:
        cleaned_transcript = re.sub(r'^[\d\n].*\n', '', transcript, flags=re.MULTILINE)
        return jsonify({"status": "success", "transcript": cleaned_transcript})
    else:
        return jsonify({"status": "error", "message": "Failed to fetch or process transcript."}), 400

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

@app.route('/chat', methods=['POST'])
def chat():
    content = request.json
    query = content['query']
    context = content['context']
    response = generate_response(query, context)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)
