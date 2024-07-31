chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.videoId) {
    console.log("Received videoId:", message.videoId);
    // Handle videoId
  } else if (message.currentTime) {
    console.log("Current Time:", message.currentTime);
    // Handle currentTime
  }
});
