// src/background.ts

let previousUrl = "";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url?.includes("youtube.com/watch")
  ) {
    if (tab.url !== previousUrl) {
      previousUrl = tab.url;
      chrome.tabs.sendMessage(tabId, { action: "urlChanged" });
    }
  }
});
