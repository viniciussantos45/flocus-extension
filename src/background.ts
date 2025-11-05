const blockedUrls = [
  "youtube.com",
  "facebook.com",
  "twitter.com",
  "instagram.com",
  "reddit.com"
]
// Base to check URL trying access
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = changeInfo.url || tab.url || null
  if (url) {
    if (blockedUrls.some((blockedUrl) => url!.includes(blockedUrl))) {
      console.log(`Tab URL changed: ${tabId} - New URL: ${url}`)
      // Redirect to block content page
      const blockPageUrl = chrome.runtime.getURL("tabs/block-content.html")
      chrome.tabs.update(tabId, { url: blockPageUrl })
    }
  } else {
    console.log(`Tab updated: ${tabId}`, changeInfo, tab)
  }
})
