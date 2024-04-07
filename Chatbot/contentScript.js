chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "searchForSrc") {
        console.log("BRUH");

        // Assume `iframeContents` is the string containing the outerHTML of the iframe document
        let iframeContents = document.querySelector('iframe').contentDocument.documentElement.outerHTML;

        // Creating a new DOM parser to parse the string into a document
        let parser = new DOMParser();
        let doc = parser.parseFromString(iframeContents, "text/html");

        // Now, you can use querySelectorAll on the parsed document
        const tracks = doc.querySelectorAll('track'); // Ensure this is 'track', not 'tracks'
        console.log(tracks.length.toString());

        if (tracks.length > 0) {
            for (let i = 0; i < tracks.length; i++) {
                const kind = tracks[i].getAttribute('kind');
                const language = tracks[i].getAttribute('language');
                const label = tracks[i].getAttribute('label');

                if (kind === "subtitles" && language === "English" && label.includes("auto-generated")) {
                    const srcValue = tracks[i].getAttribute('src');
                    console.log(srcValue);
                    sendResponse({url: srcValue}); // Return the extracted URL
                    return true; // Indicates you're sending an asynchronous response
                }
            }
            console.log(`No matching <track> elements found.`);
            sendResponse({error: "No matching <track> elements found."});
        } else {
            console.log(`No <track> elements found in the HTML content.`);
            sendResponse({error: "No <track> elements found."});
        }
        return true; // Keep the messaging channel open for the response
    }
});
