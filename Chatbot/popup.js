let currentContext = '';

document.getElementById('fetchTranscript').addEventListener('click', function() {
    // Send a message to the active tab's content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "searchForSrc"}, function(response) {
            if (chrome.runtime.lastError) {
                // Handle error, such as no content script in the tab
                console.error(chrome.runtime.lastError.message);
                addMessage('Failed to communicate with the content script.', 'chatbot');
                return;
            }

            const url = response.url; // The URL from the content script
            console.log("Received URL: ", url);

            if (!url) {
                console.error('Error: No URL found or content script did not respond as expected.');
                addMessage('Error fetching transcript. Please try another URL.', 'chatbot');
                return;
            }

            // Use the URL for the fetch request
            fetch('http://localhost:5000/fetch_transcript', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url }),
            })
            .then(response => response.json())
            .then(data => {
                if(data.status === "success") {
                    // Assuming `currentContext` and `addMessage` are defined and work as intended
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
    });
});

document.getElementById('sendQuestion').addEventListener('click', function() {
    const questionInput = document.getElementById('chatInput');
    const question = questionInput.value;
    if (!currentContext || question.trim() === '') {
        alert('Please fetch a transcript and enter a question before sending.');
        return;
    }
    addMessage(question, 'user');
    questionInput.value = '';
    showTypingIndicator();
    fetch('http://localhost:5000/chat', {
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


document.getElementById('toggleDarkMode').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const bannerImage = document.getElementById('bannerImage');
    if (document.body.classList.contains('dark-mode')) {
        bannerImage.src = 'dark.png'; // Use the path to your dark mode image
    } else {
        bannerImage.src = 'light.png'; // Use the path to your light mode image
    }
});


document.getElementById('helpButton').addEventListener('click', function() {
    alert('Type your question in the box and press Send to ask about the podcast transcript.');
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



