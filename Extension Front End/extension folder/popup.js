window.addEventListener("DOMContentLoaded", (event) => {
    const el = document.getElementById("captureBtn");
    if (el) {
      el.addEventListener("click", async () => {
            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: takeScreenshot
            });
        
      });
    }
});

function takeScreenshot() {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
        let img = new Image();
        img.src = dataUrl;
        img.style.width = '100%'; // Adjust image width
        document.getElementById('screenshotContainer').innerHTML = ''; // Clear previous screenshots
        document.getElementById('screenshotContainer').appendChild(img);
    });
}