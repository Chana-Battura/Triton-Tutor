let currentContext = '';

document.getElementById('fetchTranscript').addEventListener('click', function() {
    const url = searchForSrc();
    console.log(url)
    fetch('chanabattura.pythonanywhere.com/fetch_transcript', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === "success") {
            currentContext = data.transcript;
            addMessage('Transcript fetched successfully. You can now ask questions.', 'chatbot');
        } else {
            console.error('Error fetching transcript:', data.message);
            addMessage('Error fetching transcript. Please try another URL.', 'chatbot');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        addMessage('Failed to fetch transcript. Check your server connection.', 'chatbot');
    });
});

document.getElementById('sendQuestion').addEventListener('click', function() {
    const question = document.getElementById('chatInput').value;
    if (!currentContext || question.trim() === '') {
        alert('Please fetch a transcript and enter a question before sending.');
        return;
    }
    addMessage(question, 'user');
    showTypingIndicator();
    fetch('chanabattura.pythonanywhere.com/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: question, context: currentContext }),
    })
    .then(response => response.json())
    .then(data => {
        removeTypingIndicator();
        addMessage(data.response, 'chatbot');
    })
    .catch((error) => {
        console.error('Error:', error);
        removeTypingIndicator();
    });
});

function addMessage(text, sender) {
    const chatArea = document.getElementById('chatArea');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = text;
    messageDiv.classList.add('chat-message');
    
    if(sender === 'user') {
        messageDiv.classList.add('outgoing');
    } else {
        messageDiv.classList.add('incoming');
    }
    
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function showTypingIndicator() {
    const chatArea = document.getElementById('chatArea');
    const typingBubble = document.createElement('div');
    typingBubble.classList.add('chat-message', 'incoming', 'typing-bubble');
    typingBubble.id = 'typingIndicator';

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('typing-dot');
        typingBubble.appendChild(dot);
    }

    chatArea.appendChild(typingBubble);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function searchForSrc() {
    // Get all elements with src attribute
    const elements = document.querySelectorAll('[src]');


    // If elements found
    if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
            const srcValue = elements[i].getAttribute('src');
            const urlRegex = /https:\/\/cfvod\.kaltura\.com\/api_v3\/[^"]*/g; // Regex to match the URL
            const match = srcValue.match(urlRegex);
            if (match) {
                console.log(match[0]);
                return (match[0]); // Log the extracted URL
            }
        }
    } else {
        console.log(`No elements with src attribute found in the HTML content.`);
    }
}
