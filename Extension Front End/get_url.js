// Search for a specific word within the HTML content of the webpage
function searchForWord(word) {
    // Get the HTML content of the webpage
    const htmlContent = document.documentElement.outerHTML;


    // Split the HTML content into lines
    const lines = htmlContent.split('\n');


    // Search for the line containing the word
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(word)) {
            console.log(`Word "${word}" found at line ${i + 1}:`);
            console.log(lines[i]);
            return; // Stop searching after finding the first occurrence
        }
    }


    // If word not found
    console.log(`Word "${word}" not found in the HTML content.`);
}


// Example usage: Search for the word "example" within the HTML content of the webpage
const word = 'example';
const transcriptUrl = searchForWord('https://cfvod.kaltura.com/api_v3');