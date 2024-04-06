window.addEventListener("DOMContentLoaded", (event) => {
    const el = document.getElementById("captureBtn");
    if (el) {
        el.addEventListener("click", async () => {
            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: start // Call the start function instead of takeScreenshot
            });
            searchForURL('https://cfvod.kaltura.com/api_v3/', el.id); // Pass the id of the button
        });
    }
});

function start() {
    // Define your logic to start capturing screenshots here
}

// Search for a specific URL within the HTML content of the webpage
function searchForURL(urlSubstring, buttonId) {
    // Get the HTML content of the webpage
    const htmlContent = document.documentElement.outerHTML;

    // Search for the URL containing the given substring
    const urlRegex = new RegExp(`"${urlSubstring}[^"]*"`, 'g');
    const match = htmlContent.match(urlRegex);

    // If URL found
    if (match) {
        console.log(`URL containing "${urlSubstring}" found: ${match[0]}`);
        console.log(`Button ID: ${buttonId}`); // Log the id of the button
        return match[0];
    } else {
        console.log(`URL containing "${urlSubstring}" not found in the HTML content.`);
        return null;
    }
}
