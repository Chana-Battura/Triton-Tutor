let currentContext = '';

document.getElementById('fetchTranscript').addEventListener('click', function() {
    fetch('http://localhost:5000/fetch_transcript', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: searchForURL('https://cfvod.kaltura.com/api_v3/') }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === "success") {
            currentContext = data.transcript;
            document.getElementById('chatArea').textContent = 'Transcript fetched successfully. You can now ask questions.';
        } else {
            console.error('Error fetching transcript:', data.message);
            document.getElementById('chatArea').textContent = 'Error fetching transcript. Please try another URL.';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('chatArea').textContent = 'Failed to fetch transcript. Check your server connection.';
    });
});

document.getElementById('sendQuestion').addEventListener('click', function() {
    const question = document.getElementById('chatInput').value;
    if (!currentContext || question.trim() === '') {
        alert('Please fetch a transcript and enter a question before sending.');
        return;
    }
    fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: question, context: currentContext }),
    })
    .then(response => response.json())
    .then(data => {
        const chatArea = document.getElementById('chatArea');
        chatArea.textContent += `\nYou: ${question}\nChatbot: ${data.response}`;
        chatArea.scrollTop = chatArea.scrollHeight; // Scroll to the bottom
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function searchForURL(urlSubstring) {
    // Get the HTML content of the webpage
    const htmlContent = document.documentElement.outerHTML;

    // Search for the URL containing the given substring
    const urlRegex = new RegExp(`"${urlSubstring}[^"]*"`, 'g');
    const match = htmlContent.match(urlRegex);

    // If URL found
    if (match) {
        console.log(`URL containing "${urlSubstring}" found: ${match[0]}`);
        return match[0];
    } else {
        console.log(`URL containing "${urlSubstring}" not found in the HTML content.`);
        return null;
    }
}