// Search for a specific URL within the HTML content of the webpage
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

// Example usage: Search for a URL containing "https://cfvod.kaltura.com/api_v3/" within the HTML content of the webpage
const foundURL = searchForURL('https://cfvod.kaltura.com/api_v3/');

// If the URL is found, you can further process it if needed
if (foundURL) {
    // Further processing
}
